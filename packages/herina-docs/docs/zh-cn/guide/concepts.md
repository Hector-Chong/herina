# 概念

## 全量更新

从开发者指定的服务器下载新的 Bundle，并替换原始的 Bundle。

## 递增式更新

此项更新要求项目必须为 Git 仓库。Herina 使用 Git 日志找到和上一次 commit 的差异部分，并构建一个包含所有被修改过的模块的 Chunk。同时，Herina 创建一个名为 `versions.json` 的文件，它包含最新的版本号，和历史版本记录。当构建完成之后，请将它们上传到服务器。

当相关 API 被调用时，Herina 将发送一个请求以获取 `versions.json`，来了解哪些版本可以更新。然后，下载全部的 Chunk 并生成一个新的 Bundle 来替换上一个或原始的 Bundle。

## manifest.json

用于记录模块 ID 的 JSON 文件。

::: warning
这个文件极其重要。

**在 App 重新分发至应用商店之前，不得将它删除或进行修改。**

否则，构建出的更新将包含错误的模块 ID 导致加载错误。
:::

## versions.json

用于记录当前版本信息与历史版本记录的 JSON 文件。

下面是个例子：

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

## 自动重置 Bundle

你的代码可能有一个逻辑错误，并且你还为它构建了一次更新。在这种情况下，你的 App 可能会崩溃。这样的后果特别严重，因为你的用户可能无法再次启动 App。

为解决这个问题，Herina 劫持了默认的 `requrie` 实现。当入口文件被引入时，通常它的模块 ID 为1，Herina 将使用 React Native 自带的 `ErrorUtils` 捕获潜在的错误。一旦发生错误，JS 运行时将向原生发起请求，重置回原始的 Bundle 并重载 App。

## 代码拆分

Herina 将 Bundle 拆分为三种不同的 Chunk：

- 业务包: 包含 App 的业务代码；
- 动态包: 包含使用 `import(...)` 导入的模块；
- 基础包: 包含 `node_modules` 内的依赖于 Herina 运行时

## 原始 Bundle

在 App 构建期间生成的 Bundle。