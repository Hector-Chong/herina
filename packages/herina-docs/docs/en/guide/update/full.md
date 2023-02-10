# Full Update

Downloads a new bundle from a server that developer assigns, and replaces the original one (the bundle built in the App).

## Build Update

You may use function or CLI to build update.

::: code-group

```typescript [function]
import {build} from '@herina-rn/core';
import herinaConfig from './herina.config';

const start = async (config: any) => {
  await build(config);
};

start(herinaConfig);
```

```bash [CLI]
npx herina build-chunks herina.config.js
```

:::

## Build `versions.json`

::: tip
Ignore this step if `versions.json` is built before.
:::

::: code-group

```typescript [function]
import {buildVersionsJson, HerinaConfig} from '@herina-rn/core';
import herinaConfig from './herina.config';

const start = async (config: HerinaConfig) => {
  await buildVersionsJson(config);
};

start(herinaConfig);
```

```bash [CLI]
npx herina build-versions-json herina.config.js
```

:::

## Upload Files

After the update is built, upload the output files to the server matching `baseUrl` in the configuration.

The files to upload include:

- `main.chunk.js`
- `*.dynamic.chunk.js`
- `versions.json`

## Download Bundle

Before downloading the update, you are supposed to check whether an update is available by calling `checkForUpdate`.

```typescript
checkForUpdate(): Promise<boolean>
```

::: info
If you want to show what the latest version includes, you should implement this by yourself.
:::

After checking the version, call `requestUpdate` to download the latest bundle.

```typescript
requestUpdate(): Promise<boolean>;
```

## Apply Update

Finally, call `applyUpdate` to replace the original bundle with the downloaded one.

The first argument indicates whether to reload the App after the update is applied.

```typescript
applyUpdate(immediate: boolean): Promise<boolean>;
```

If you intend to apply the update later, but you're not sure whether you've called `requestUpdate` or not. Call `isUpdateAvailable` to get your answer.

```typescript
isUpdateAvailable(): Promise<boolean>;
```

## Restore to the Original

Somehow, you shipped some code with business or logical errors that crash your App. In this case, call `setUseOriginalBundle(true)` and `reloadApp()` to restore your bundle to the original one.

```typescript
setUseOriginalBundle(original: boolean): Promise<boolean>;

reloadApp(): Promise<boolean>;
```