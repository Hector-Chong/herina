# build()

Builds chunks for the full update.

If the `version.json` was built before, this function will also write the latest version info to it.

## Arguments

| Name   | Required | Type                                         | Default Value | Note |
| ------ | -------- | -------------------------------------------- | ------------- | ---- |
| config | YES      | [`HerinaConfig`](/configuration/global.html) | /             | /    |

## Returns

```typescript
Promise<Record<string, ChunkAsset[]>>
```

```typescript
interface ChunkAsset {
  filename: string;
  code: string;
  path: string;
}
```

## Example

```typescript
import {build, defineHerinaConfig} from '@herina-rn/core';

const config = defineHerinaConfig({ ... });

build(config);
```