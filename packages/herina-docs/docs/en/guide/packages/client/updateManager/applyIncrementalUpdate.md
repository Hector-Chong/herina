# applyIncrementalUpdate()

Generate a new bundle and replace the original one with it.

## Arguments

| Name      | Required | Type    | Default Value | Note                                         |
| --------- | -------- | ------- | ------------- | -------------------------------------------- |
| immediate | NO       | boolean | `false`       | Reload the App after the bundle is replaced. |

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
