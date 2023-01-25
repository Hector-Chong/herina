# Incremental Update

Incremental update requires your project to be a Git repository to find out the differences from the last commit. Heina builds a chunk including all modified modules for updating.

## Build Update

You may use function or CLI to build update.

:::code-group

```typescript [function]
import { buildIncremental } from "@herina/core";
import config from "./herina.config";

const start = async () => {
  await buildIncremental(config);
};

start();
```

```bash [CLI]
npx herina build -i herina.config.ts
# or
npx herina build --incremental herina.config.ts
```

:::

## Upload Files

After the update is built, upload the output files to the server matching `baseUrl` in the configuration.

The files to upload include:

- `incremental/*.js`
- `versions.json`

## Download Bundle

Before downloading the update, you are supposed to check whether an update is available by calling `checkForUpdate`.

```typescript
checkForUpdate(): Promise<boolean>
```

::: info
If you want to show what the latest version includes, you should implement this by yourself.
:::

After checking the version, call `requestIncrementalUpdates` to download chunks whose version number is bigger than the current.

```typescript
requestIncrementalUpdates(): Promise<boolean>;
```

## Apply Update

Finally, call `applyIncrementalUpdate` to generate a new bundle to replace the original one.

The first argument indicates whether to reload the App after the update is applied.

```typescript
applyIncrementalUpdate(immediate: boolean): Promise<boolean>;
```

If you intend to apply the update later, but you're not sure whether you've called `requestIncrementalUpdates` or not. Call `isIncrementalUpdateAvailable` to get your answer.

```typescript
isIncrementalUpdateAvailable(): Promise<boolean>;
```
