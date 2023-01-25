# checkForUpdate()

Sends a request to `versions.json` from remote to check whether an update is available.

:::info

The response will be cached by defualt. If you don't want to cache the resposne, call [`clearCache()`](/guide/packages/client/updateManager/clearCache.html) first.

:::

## Arguments

None

## Returns

```typescript
Promise<boolean>;
```

## Example

```typescript
import { getUpdateManager } from "@herina-rn/client";

const manager = getUpdateManager();

const isUpdateAvailable = async () => {
  return manager.checkForUpdate();
};

await isUpdateAvailable();
```
