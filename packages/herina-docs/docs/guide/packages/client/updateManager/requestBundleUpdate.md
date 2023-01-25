# requestBundleUpdate()

Calls [`checkForUpdate()`](/guide/packages/client/updateManager/checkForUpdate.html). If the result is `true`, downloads the new bundle.

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
    await manager.requestBundleUpdate();

    await manager.applyBundleUpdate(true);
  } else {
    Alert.alert("No need to update.");
  }
};

await updateBundle();
```
