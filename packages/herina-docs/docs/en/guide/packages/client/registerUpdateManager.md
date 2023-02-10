# registerUpdateManager()

Returns the singleton instance of [UpdateManager](/guide/packages/client/updateManager/introduction.html).

## Arguments

| Name    | Required | Type   | Default Value | Note |
| ------- | -------- | ------ | ------------- | ---- |
| baseUrl | NO       | string | /             | /    |

## Returns

```typescript
typeof UpdateManager;
```

## Example

```typescript
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager("https://hector.im");
```
