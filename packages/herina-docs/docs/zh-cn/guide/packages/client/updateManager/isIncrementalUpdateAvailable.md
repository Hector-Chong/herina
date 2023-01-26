# isIncrementalUpdateAvailable()

检查是否之前下载过递增式更新文件。

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
  if (await manager.isIncrementalUpdateAvailable()) {
    await manager.applyIncrementalUpdate(true);
  } else {
    Alert.alert("Have not downloaded incremental updates.");
  }
};

await updateBundle();
```
