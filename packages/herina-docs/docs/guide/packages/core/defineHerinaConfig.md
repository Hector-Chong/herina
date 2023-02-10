# defineHerinaConfig

创建 Herina 配置文件对象。

此函数不仅保证类型安全，还会向参数对象添加默认属性。

## 参数

| 参数名 | 必填 | 类型                                               | 默认值 | 备注 |
| ------ | ---- | -------------------------------------------------- | ------ | ---- |
| config | YES  | [`HerinaConfig`](/configuration/global.html) | /      | /    |

## 返回值

```typescript
interface HerinaConfig
```

## 代码示例

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
