# Concepts

## Full Update

Downloads a new bundle from a server that developer assigns, and replaces the original one (the bundle built in the App).

## Incremental Update

This type of update requires your project to be a Git repository. Herina uses the Git log to find out the differences from the last commit, and build a chunk including all modified modules. At the same time, Herina creates a file named `versions.json` including the lastest version number and the history version records. When the build is done, upload them to your server.

When relative APIs are invoked, Herina will send a request to fetch `versions.json` that was just created to know what versions are available. Then, download all the chunks and generate a new bundle to replace the previous or original one.

## manifest.json

A JSON file to record module IDs.

::: warning
This file is extremely significant. 

**Do not delete or modify it until your App is re-distributed on the App Store**.

Otherwise, a built update would include wrong module IDs causing loading errors.
:::

## versions.json

A JSON file recording the current version info and history version records.

Here is an example.

```json
{
    "currentVersionNum": 3,
    "currentCommitHash": "5c3d1692cef3ab85a8a6876881e4dacc6893d760",
    "previousCommitHash": "d2d58f077fc71aab854c1b3d96e28ee5e5f24da1",
    "history": [
        {
            "commitHash": "ba34f0d252150151e48b8d4d0ada36850cca4d20",
            "versionNum": 2,
            "filePath": "d515cb56331ec005608ef533c43fba67.js"
        },
        {
            "commitHash": "51ad27d23ab60a30025f85f8c32a84bb2182280c",
            "versionNum": 1,
            "filePath": "e2d817888efb8dbce3c7cb8f918e924b.js"
        }
    ]
}
```


## Auto-restore Bundle

There could be a logical error in your code, and you build an update for that. In this case, your App might crash. This is serious because your user might find trouble launching the App. 

To help with this issue, Herina hijacks the default implementation of `requrie`. When the entry file is required, usually the module ID is 1, Herina uses `ErrorUtils` provided by React Native to catch an error if it happens. If it does, a request will be sent to the native to restore the original bundle and reload the App.

## Code Splitting

Herina divides bundle into three types of chunks:

- Business: includes the business code of the App.
- Dynamic: includes a module imported by using `import(...)`.
- Vendor: includes dependencies in `node_modules` and Herina’s runtime.

## Original Bundle

The bundle was created during the build of the App.