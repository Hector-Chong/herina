# requestIncrementalUpdates()

Calls [`checkForUpdate()`](/guide/packages/client/updateManager/checkForUpdate.html). If the result is `true`, downloads all available update files.

## Arguments

None

## Returns

```typescript
Promise<boolean>;
```

## Example

```typescript
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager();

const updateBundle = async () => {
  if (await manager.checkForUpdate()) {
    await manager.requestIncrementalUpdates();

    await manager.applyIncrementalUpdate(true);
  } else {
    Alert.alert("No need to update.");
  }
};

await updateBundle();
```
