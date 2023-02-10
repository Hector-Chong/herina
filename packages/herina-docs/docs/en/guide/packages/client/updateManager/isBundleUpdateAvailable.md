# isUpdateAvailable()

Check if there is a bundle downloaded before.

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
  if (await manager.isUpdateAvailable()) {
    await manager.applyUpdate(true);
  } else {
    Alert.alert("Have not downloaded the bundle.");
  }
};

await updateBundle();
```
