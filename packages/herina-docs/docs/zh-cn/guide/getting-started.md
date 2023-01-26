# 开始上手

Herina 提供两种更新：[全量更新、递增式更新](/zh-cn/guide/concepts#full-update).

为节约篇幅，将在此演示全量更新。

## 步骤. 1: 创建配置文件

在项目根目录创建名为 `herina.config.ts` 的文件。

然后，从 `@herina-rn/core` 导入 `defineHerinaConfig`，之后调用这个函数来创建配置，并进行导出。

举个例子：

```typescript
import { defineHerinaConfig } from "@herina-rn/core";

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
若要了解更多细节，请参考[配置文档](/zh-cn/configuration/introduction)。
:::

## 步骤. 2: 构建更新

你可使用函数或 CLI 构建更新。

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
npx herina build -f herina.config.ts
# or
npx herina build --full herina.config.ts
```

:::

## 步骤. 3: 构建 `versions.json`

这一步是至关重要的。没有这个文件，Herina 将不知道 Bundle 的最新版本号，也就是说没有可用的更新。

::: code-group

```typescript [function]
import { buildVersionsJson, HerinaConfig } from "@herina-rn/core";
import herinaConfig from "./herina.config";

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

## 步骤. 4: 将文件上传至服务器

打开你在配置文件指定的输出目录，你会看到以下文件：

```
- dist
  | -- 176a85.dynamic.chunk.js
  | -- u190xa.dynamic.chunk.js
  | -- main.chunk.js
  | -- vendor.chunk.js
  | -- versions.json
```

以 `dynamic.chunk.js` 为结尾命名的文件是[动态 Chunk](/zh-cn/guide/concepts.html#code-splitting)。

将动态 Chunk、`main.chunk.js` 和 `versions.json` 上传到与配置文件的 `baseUrl` 对应的服务器。

## 步骤. 5: 调用 JS API

首先，你需要 `registerUpdateManager` 获取 `UpdateManager` 对象。第一个参数是可选的，它代表的是所访问资源（通常为生成的 Bundle、Chunk）的 Base URL，若此参数未被定义，将读取原始 Bundle 内的 Base URL。

然后，调用 `requestBundleUpdate` 下载新的 Bundle。这个函数返回一个 Promise 对象。

最后，当 Promise 为 Resolved 状态时，调用 `applyBundleUpdate` 以应用新的 Bundle 并重载 App。

```typescript
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager("https://hector.im");

const onUpdateByFull = async () => {
  await manager.requestBundleUpdate();

  manager.applyBundleUpdate(true);
};
```
