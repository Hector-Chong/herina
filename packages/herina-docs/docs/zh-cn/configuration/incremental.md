# Incremental Config

By adding `incremental` key to customize configuration.

```typescript
import { defineHerinaConfig } from "@herina-rn/core";

export default defineHerinaConfig({
  environment: "production",
  baseUrl: "https://hector.im",
  //...

  // Incremental-related configurations.
  incremental: {
    previousCommitHash: "",
    currentCommitHash: "",
    pure: false,
    filePath: ""
  }
});
```

## previousCommitHash

- Type: `string`
- Default: the last commit hash of your project

From which Git commit to build incremental update.

## currentCommitHash

- Type: `string`
- Default: the current commit hash of your project

To which Git commit to build incremental update.

## pure

- Type: `boolean`
- Default: `false`

This option works with `incremental.filePath`. If it is `true`, after the incremental update is built, version info won't be recorded in versions.json, and the output file will be placed at `incremental.filePath`.

## filePath

- Type: `string`
- Default: `''`

Where to place output file when `incremental.pure` is true.
