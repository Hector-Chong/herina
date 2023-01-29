# 递增式更新

递增式更新要求项目必须为 Git 仓库，以找到与上一 Commit 之间的差异。Herina 将创建一个 Chunk 包含所有发生修改的模块用于更新。

## 构建更新

你可使用函数或 CLI 构建更新。

:::code-group

```typescript [function]
import { buildIncremental } from "@herina-rn/core";
import config from "./herina.config";

const start = async () => {
  await buildIncremental(config);
};

start();
```

```bash [CLI]
npx herina build-incremental herina.config.js
```

:::

## 上传文件

当更新构建或，将输出的文件上传到与配置文件的 `baseUrl` 对应的服务器。

上传的文件包括：

- `incremental/*.js`
- `versions.json`

## 下载更新

在下载更新之前，请调用 `checkForUpdate` 检查是否有可用的更新。

```typescript
checkForUpdate(): Promise<boolean>
```

::: info
若你要展示最新版本的内容，请自行实现此功能。
:::

在版本检查完成后，调用 `requestIncrementalUpdates` 下载比当前版本号更大的更新文件。

```typescript
requestIncrementalUpdates(): Promise<boolean>;
```

## 应用更新

最后，调用 `applyIncrementalUpdate` 生成一个新的 Bundle 替换原始 Bundle。

第一个参数表示是否在更新应用后，重载 App。

```typescript
applyIncrementalUpdate(immediate: boolean): Promise<boolean>;
```

如果你打算在后面应用更新，但是不确定是否之前是否调用了 `requestIncrementalUpdates`，可调用 `isIncrementalUpdateAvailable` 了解是否有可用的更新文件。

```typescript
isIncrementalUpdateAvailable(): Promise<boolean>;
```
