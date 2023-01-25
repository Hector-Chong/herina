# applyBundleUpdate()

Repalce the original bundle with the downloaded one.

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
import { registerUpdateManager } from "@herina/client";

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
