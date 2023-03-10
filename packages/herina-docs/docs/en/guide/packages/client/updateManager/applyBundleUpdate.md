# applyUpdate()

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
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager();

const updateBundle = async () => {
  if (await manager.checkForUpdate()) {
    await manager.requestUpdate();

    await manager.applyUpdate(true);
  } else {
    Alert.alert("No need to update.");
  }
};

await updateBundle();
```
