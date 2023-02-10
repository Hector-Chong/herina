# isIncrementalUpdateAvailable()

Check if there is incremental updates downloaded before.

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
  if (await manager.isIncrementalUpdateAvailable()) {
    await manager.applyIncrementalUpdate(true);
  } else {
    Alert.alert("Have not downloaded incremental updates.");
  }
};

await updateBundle();
```
