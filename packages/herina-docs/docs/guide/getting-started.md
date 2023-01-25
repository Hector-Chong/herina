# Getting Started

There two types of update: [full and incremental](/guide/concepts#full-update).

To save space, the full update will be introduced here.

## Step. 1: Create the config file

Create a file named `herina.config.ts` (recommended) in the root dictionary of your project.

Then, import `defineHerinaConfig` from `@herina/core` and call it to create the configuration to be exported.

Here is an example:

```typescript
import { defineHerinaConfig } from "@herina/core";

export default defineHerinaConfig({
  environment: "production",
  baseUrl: "https://hector.im",
  root: "/Users/hectorchong/MyApp",
  entryFile: "/Users/hectorchong/MyApp/index.js",
  outputPath: "/Users/hectorchong/MyApp/dist",
  minify: false,
  platform: "ios",
  manifestPath: "/Users/hectorchong/MyApp/manifest.json"
});
```

::: info
For more details of config, refer to [Configuration](/configuraion).
:::

## Step. 2: Build update

You may use function or CLI to build update.

::: code-group

```typescript [function]
import {build} from '@herina/core';
import herinaConfig from './herina.config';

const start = async (config: any) => {
  await build(config);
};

start(herinaConfig);
```

```bash [CLI]
npx herina build -f herina.config.ts
# or
npx herina build --full herina.config.ts
```

:::

## Step. 3: Build `versions.json`

This step is essential. Without the file, Herina would not know the newest version number of your bundle, which means no updates are available.

::: code-group

```typescript [function]
import {buildVersionsJson, HerinaConfig} from '@herina/core';
import herinaConfig from './herina.config';

const start = async (config: HerinaConfig) => {
  await buildVersionsJson(config);
};

start(herinaConfig);
```

```bash [CLI]
npx herina build -v herina.config.ts
# or
npx herina build --version-json herina.config.ts
```

:::

## Step. 4: Upload files to server

Take a look at the output dictionary that you assigned in the configuration file. You might see the files below.

```
- dist
  | -- 176a85.dynamic.chunk.js
  | -- u190xa.dynamic.chunk.js
  | -- main.chunk.js
  | -- vendor.chunk.js
  | -- versions.json
```

Files whose names are suffixed with `dynamic.chunk.js` are [dynamic chunks](/guide/concepts.html#code-splitting).

Along with dynamic chunks, upload `main.chunk.js` and `versions.json` to your server matching `baseUrl` in the configuration.

## Step. 5: Invoke APIs in JS

First, you need to call `registerUpdateManager` to get `UpdateManager` instance. The first argument indicating the base URL for your resources to be downloaded is optional.

Then, call `requestBundleUpdate` to download the new bundle. This function returns a Promise. 

Finally, When the promise is resolved, call `applyBundleUpdate` to apply the new bundle and reload the App.

```typescript
import {registerUpdateManager} from '@herina/client';

const manager = registerUpdateManager('https://hector.im');

const onUpdateByFull = async () => {
  await manager.requestBundleUpdate();

  manager.applyBundleUpdate(true);
};
```

