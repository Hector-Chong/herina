# 全量更新

从开发者指定的服务器下载新的 Bundle，并替换原始的 Bundle。

## 构建更新

你可使用函数或 CLI 构建更新。

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

## 构建 `versions.json`

::: tip
若之前已经构建了 `versions.json`，可跳过此步骤。
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

## 上传文件

当更新构建或，将输出的文件上传到与配置文件的 `baseUrl` 对应的服务器。

上传的文件包括：

- `main.chunk.js`
- `*.dynamic.chunk.js`
- `versions.json`

## 下载 Bundle

在下载 Bundle 之前，请调用 `checkForUpdate` 检查是否有可用的更新。

```typescript
checkForUpdate(): Promise<boolean>
```

::: info
若你要展示最新版本的内容，请自行实现此功能。
:::

在版本检查完成后，调用 `requestBundleUpdate` 下载最新的 Bundle。

```typescript
requestBundleUpdate(): Promise<boolean>;
```

## 应用更新

最后，调用 `applyBundleUpdate` 使用下载的 Bundle 替换原始 Bundle。

第一个参数表示是否在更新应用后，重载 App。

```typescript
applyBundleUpdate(immediate: boolean): Promise<boolean>;
```

如果你打算在后面应用更新，但是不确定是否之前是否调用了 `requestBundleUpdate`，可调用 `isBundleUpdateAvailable` 了解是否下载过 Bundle。

```typescript
isBundleUpdateAvailable(): Promise<boolean>;
```

## 重置回原始 Bundle

某些情况下，你发布了带有业务或逻辑错误且会导致 App 崩溃的代码。在这种情况下，调用 `setUseOriginalBundle(true)` 和 `reloadApp()` 将重置回原始 Bundle。

```typescript
setUseOriginalBundle(original: boolean): Promise<boolean>;

reloadApp(): Promise<boolean>;
```