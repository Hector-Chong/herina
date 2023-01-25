# getUpdateManager

Get the instance of [UpdateManager](/guide/packages/client/updateManager.html) that [`registerUpdateManager`](/guide/packages/client/registerUpdateManager.html) returns.

:::warning

This function can not be called before `registerUpdateManager`.

:::

## Arguments

None

## Returns

```typescript
typeof UpdateManager;
```

## Example

```typescript
import { registerUpdateManager, getUpdateManager } from "@herina/client";

registerUpdateManager("https://hector.im");

const manager = getUpdateManager();
```
