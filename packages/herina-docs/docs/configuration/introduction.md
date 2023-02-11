# 介绍

在项目根目录，创建一个名为 `herina.config.js` 或 `herina.config.ts` 的文件。此文件用于声明 Herina 配置。

## 配置智能提示

### JSDOC

::: tip 提示
这是推荐的方式，因为 Bundle 的构建环境只支持 CommonJS，使用 ESM 将导致错误。
:::

若此配置无法在您的 IDE 正常使用，请确保已安装 JSDOC 相关插件。

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

### TypeScript

::: warning 提示
此方式虽然能够保障类型安全，但是不被 Bundle 的构建环境支持。若您坚持使用此方式，请自行采取相关措施，将其转换为 CommonJS。
:::

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
