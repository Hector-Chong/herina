# Introduction

Created a file named `herina.config.ts` (recommended) or `herina.config.js` in your project dictionary. This file specifies the configuration of Herina.

## Config Intellisense

### TypeScript (Recommended)

Name your configuration file to `herina.config.ts`. import `defineHerinaConfig` from `@herina-rn/core` like this:

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

If this does not work on your IDE, make sure you've installed JSDOC-specific plugins.

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