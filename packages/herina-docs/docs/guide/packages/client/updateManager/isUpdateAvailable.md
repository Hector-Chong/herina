# isUpdateAvailable()

检查是否有可用的更新包。

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
  if (await manager.isUpdateAvailable()) {
    await manager.applyUpdate(true);
  } else {
    Alert.alert("Have not downloaded the update.");
  }
};

await updateBundle();
```
