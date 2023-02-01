# 全局配置

## environment

- **必填**
- 类型：`'development' | 'production'`

Bundle 的构建模式。

在生产模式下，用于监控性能的代码可能会被移除，并且 Bundle 会使用 Terser 进行压缩。

## baseUrl

- **必填**
- 类型：`string` | `Record<'android' | 'ios', string>`

用于访问资源的基础 URL。此配置项将用于拼接资源文件名。

当你调用 `requestBundleUpdate` 时，Herina 会把 Bundle 的文件名和 `baseUrl` 拼接起来。假设 `baseUrl` 为 `https://hector.im`，获取业务包的完整 URL 为 `https://hector.im/main.chunk.js`。

若 `baseUrl` 为对象，可以为各个平台配置不同的基础 URL。

你应该使用 HTTPS 协议。否则，你的请求会被系统视为不安全的连接。

## entryFile

- **必填**
- 类型：`string`

项目入口文件的路径。通常是项目根目录的 `index.js`。

## outputPath

- **必填**
- 类型：`string`

输出文件的存放路径。

## manifestPath

- **必填**
- 类型：`string`

[`manifest.json`](/zh-cn/guide/concepts.html#manifest-json) 的存放路径。

## platform

- **必填**
- 类型：`'ios' | 'android'`

Bundle 构建的目标平台。

## clean

- 类型：`boolean`
- 默认值：`false`

Whether to clean `outputPath` or not before buidling.

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
