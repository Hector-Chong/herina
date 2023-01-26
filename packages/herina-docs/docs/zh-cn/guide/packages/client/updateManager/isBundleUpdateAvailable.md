# isBundleUpdateAvailable()

检查是否之前下载过 Bundle。

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
  if (await manager.isBundleUpdateAvailable()) {
    await manager.applyBundleUpdate(true);
  } else {
    Alert.alert("Have not downloaded the bundle.");
  }
};

await updateBundle();
```
