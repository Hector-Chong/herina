# requestUpdate()

调用 [`checkForUpdate()`](/guide/packages/client/updateManager/checkForUpdate.html)。如返回结果为 `true`，则下载更新包。

## 参数

None

## 返回值

```typescript
Promise<boolean>;
```

## 代码示例

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
