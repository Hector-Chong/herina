# clearCache()

清除网络缓存。

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

const clearCacheBeforeChecking = async () => {
  manager.clearCache();

  return manager.checkForUpdate();
};

await clearCacheBeforeChecking();
```
