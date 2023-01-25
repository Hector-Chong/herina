# defineHerinaConfig

Create an object of Herina configuration.

This function not only ensures the typing correctness, but also adds default properties to the object from the argument.

## Arguments

| Name   | Required | Type                                         | Default Value | Note |
| ------ | -------- | -------------------------------------------- | ------------- | ---- |
| config | YES      | [`HerinaConfig`](/configuration/global.html) | /             | /    |

## Returns

```typescript
interface HerinaConfig
```

## Example

```typescript
import { defineHerinaConfig } from "@herina/core";

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
