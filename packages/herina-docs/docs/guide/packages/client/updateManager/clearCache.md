# clearCache()

Clears network cache.

## Arguments

None

## Returns

```typescript
Promise<boolean>;
```

## Example

```typescript
import { registerUpdateManager } from "@herina/client";

const manager = registerUpdateManager();

const clearCacheBeforeChecking = async () => {
  manager.clearCache();

  return manager.checkForUpdate();
};

await clearCacheBeforeChecking();
```
