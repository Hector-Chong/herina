# 介绍

在项目根目录，创建一个名为 `herina.config.ts`（推荐）或 `herina.config.js` 的文件。此文件用于声明 Herina 配置。

## 配置智能提示

### TypeScript（推荐）

将配置文件命名为 `herina.config.ts`，并从 `@herina-rn/core` 导入 `defineHerinaConfig` 如下：

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

### JSDOC

若此配置无法在你的 IDE 正常使用，请确保已安装 JSDOC 相关插件。

```js
/**
 * @type {import('@herina-rn/core').HerinaConfig}
 */
module.exports = {
  environment: "production",
  baseUrl: "https://hector.im",
  root: "/Users/hectorchong/MyApp",
  entryFile: "/Users/hectorchong/MyApp/index.js",
  outputPath: "/Users/hectorchong/MyApp/dist",
  minify: false,
  platform: "ios",
  manifestPath: "/Users/hectorchong/MyApp/manifest.json"
};
```
