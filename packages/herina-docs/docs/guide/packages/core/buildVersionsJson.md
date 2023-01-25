# buildVersionsJson()

Builds [`versions.json`](/guide/concepts.html#versions-json) and place it to a certain location.

## Arguments

| Name   | Required | Type                                         | Default Value | Note |
| ------ | -------- | -------------------------------------------- | ------------- | ---- |
| config | YES      | [`HerinaConfig`](/configuration/global.html) | /             | /    |

## Returns

Returns the location of `version.json`.

```typescript
Promise<string>
```

## Example

```typescript
import {buildVersionsJson, defineHerinaConfig} from '@herina/core';

const config = defineHerinaConfig({ ... });

const filePath = buildVersionsJson(config);
```