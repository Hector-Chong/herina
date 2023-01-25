# isBundleUpdateAvailable()

Check if there is a bundle downloaded before.

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

const updateBundle = async () => {
  if (await manager.isBundleUpdateAvailable()) {
    await manager.applyBundleUpdate(true);
  } else {
    Alert.alert("Have not downloaded the bundle.");
  }
};

await updateBundle();
```
