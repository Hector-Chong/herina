# 全局配置

## environment

- **必填**
- 类型：`'development' | 'production'`

Bundle 的构建模式。

在生产模式下，用于监控性能的代码可能会被移除，并且 Bundle 会使用 Terser 进行压缩。

## baseUrl

- **必填**
- 类型：`` string` | `Record<'android' | 'ios', string> ``

用于访问资源的基础 URL。此配置项将用于拼接资源文件名。

当您调用 `requestUpdate` 时，Herina 会把文件名和 `baseUrl` 拼接起来。假设 `baseUrl` 为 `https://hector.im`，文件包名为 `main.chunk.js`，获取更新包的完整 URL 为 `https://hector.im/main.chunk.js`。

若 `baseUrl` 为对象，可以为各个平台配置不同的基础 URL。

您应该使用 HTTPS 协议。否则，您的请求会被系统视为不安全的连接。

## entryFile

- **必填**
- 类型：`string`

项目入口文件的路径。通常是项目根目录的 `index.js`。

## outputPath

- **必填**
- 类型：`` string` | `Record<'android' | 'ios', string> ``

输出文件的存放路径。

若 `outputPath` 为对象，可以为各个平台配置不同的存放路径。

## manifestPath

- **必填**
- 类型：`` string` | `Record<'android' | 'ios', string> ``

[`manifest.json`](/guide/concepts.html#manifest-json) 的存放路径。

若 `manifestPath` 为对象，可以为各个平台配置不同的 `manifest.json` 存放路径。

## platform

- **必填**
- 类型：`'ios' | 'android'`

Bundle 构建的目标平台。

## clean

- 类型：`boolean`
- 默认值：`false`

是否在构建更新前，清空 `outputPath`。

## minify

- 类型：`boolean`
- 默认值：`false`

表示是否使用 Terser 压缩输出文件。

若 `environment` 为 `production`，此配置项将不会生效。

## root

- 类型：`string`
- 默认值：`process.cwd()`

项目根目录的路径。

## extensions

- 类型：`string[]`
- 默认值：`["js", "jsx", "ts", "tsx"]`

此配置项用于动态引入模块。当一个未设置后缀名的模块被动态导入时，将使用 `extensions` 尝试匹配正确的后缀名。

## maxWorkers

Metro 用于并发处理进程的 Worker 数。

- 类型：`number`
- 默认值：`cpus().length`

## previousCommitHash

- 类型：`string`
- 默认值：上一个版本的 Commit 的哈希值

从某一个 Commit 开始构建更新。

## currentCommitHash

- 类型：`string`
- 默认值：当前项目的 Commit 的哈希值

截止到某一个 Commit 构建更新。

## updateType

- 类型：`HerinaUpdateType`
- 默认值：`HerinaUpdateType.ALL`

指定构建的更新类型。

- `HerinaUpdateType.ALL`：构建全量更新与增量更新
- `HerinaUpdateType.FULL`：只构建全量更新
- `HerinaUpdateType.INCREMENTAL`：只构建增量更新

## currentReleaseVersionNum

- 类型：`number`

指定[发行版本号](/guide/concepts.html#发行版本号-release-version-number)。

## checkNativeChange

- 类型：`boolean`
- 默认值：`true`

构建更新时，检查原生代码是否发生了修改。

## iosSourcePath

- 类型：`string`
- 默认值：`path.join(root, "ios")`

iOS 工程路径。

## androidSourcePath

- 类型：`string`
- 默认值：`path.join(root, "ios")`

Android 工程路径。

## metaInfo

- 类型：可被 `JSON.stringify` 正常转换的对象类型

版本元信息。