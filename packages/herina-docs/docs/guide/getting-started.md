# 开始上手

## 步骤. 1: 创建配置文件

在项目根目录创建名为 `herina.config.js` 的文件。

然后创建如下对象，并以 CommonJS 的形式导出。

```javascript
/**
 * 此注释为 JSDOC 注解，用于在 IDE 提示配置项，可省略
 * @type {import('@herina-rn/core').HerinaConfig}
 */ 
module.exports = {
  environment: "production",
  baseUrl: "https://hector.im",
  root: "/Users/hectorchong/MyApp",
  entryFile: "/Users/hectorchong/MyApp/index.js",
  outputPath: "/Users/hectorchong/MyApp/dist",
  platform: "ios",
  manifestPath: "/Users/hectorchong/MyApp/manifest.json"
};
```

::: info
若要了解更多细节，请参考[配置文档](/configuration/introduction)。
:::

## 步骤. 2: 构建更新

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
npx herina build herina.config.js
```

:::

## 步骤. 3: 将文件上传至服务器

打开您在配置文件指定的输出目录 `outputPath`，并将里面所有文件上传到与配置文件的 `baseUrl` 对应的服务器或 CDN。

## 步骤. 4: 调用 JS API

首先，您需要 `registerUpdateManager` 获取 `UpdateManager` 对象。第一个参数是可选的，它代表更新文件地址的 Base URL，若此参数未被定义，将读取原始 Bundle 内的 Base URL。

然后，调用 `requestUpdate` 下载更新包。这个函数返回一个 Promise 对象。

最后，当 Promise 为 Resolved 状态时，调用 `applyUpdate` 以应用更新并重载 App。

```typescript
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager("https://hector.im");

const onUpdate = async () => {
  await manager.requestUpdate();

  manager.applyUpdate(true);
};
```
