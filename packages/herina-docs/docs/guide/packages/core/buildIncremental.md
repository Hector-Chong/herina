# buildIncremental()

Builds an incremental update.

If the `version.json` was built before, this function will also write the latest version info to it.

:::warning

Make sure your project is in a Git repository. You might refer to [Incremental Update](/guide/update/incremental.html).

:::

## Arguments

| Name   | Required | Type                                         | Default Value | Note |
| ------ | -------- | -------------------------------------------- | ------------- | ---- |
| config | YES      | [`HerinaConfig`](/configuration/global.html) | /             | /    |

## Returns

Returns the location of the output file.

```typescript
Promise<string>
```

## Example

```typescript
import {buildIncremental, defineHerinaConfig} from '@herina-rn/core';

const config = defineHerinaConfig({ ... });

const filePath = buildIncremental(config);
```