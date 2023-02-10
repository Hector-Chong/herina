# 代码更新

Herina 默认优先使用增量更新，这种方式能够节约资源和加快更新进程。若增量更新失败，则自动切换全量更新。

## 1. 构建更新

您可使用函数或 CLI 构建更新。

::: code-group

```typescript [function]
import { build } from "@herina-rn/core";
import herinaConfig from "./herina.config";

const start = async (config: any) => {
  await build(config);
};

start(herinaConfig);
```

```bash [CLI]
npx herina build-chunks herina.config.js
```

:::

## 2. 上传文件

当更新构建完成后，将输出到 `outputPath` 的所有文件上传到与配置文件的 `baseUrl` 对应的服务器或 CDN。

## 3. 下载更新包

在下载 Bundle 之前，请调用 `checkForUpdate` 检查是否有可用的更新。

```typescript
checkForUpdate(): Promise<boolean>
```

::: info
若您要展示最新版本的内容，请自行实现此功能。
:::

在版本检查完成后，调用 `requestUpdate` 下载更新包。

```typescript
requestUpdate(): Promise<boolean>;
```

## 4. 应用更新

最后，调用 `applyUpdate` 以应用更新。

第一个参数表示是否在更新应用后，重载 App。

```typescript
applyUpdate(immediate: boolean): Promise<boolean>;
```

如果您打算在后面应用更新，但是不确定是否之前是否调用了 `requestUpdate`，可调用 `isUpdateAvailable` 了解是否下载过 Bundle。

```typescript
isUpdateAvailable(): Promise<boolean>;
```

## 重置回原始 Bundle

某些情况下，您发布了带有错误的代码。在这种情况下，调用 `setUseOriginalBundle(true)` 和 `reloadApp()` 将重置回原始 Bundle。

```typescript
setUseOriginalBundle(original: boolean): Promise<boolean>;

reloadApp(): Promise<boolean>;
```
