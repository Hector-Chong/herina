# checkForUpdate()

从服务器获取 `versions.json` 检查是否有可用更新。

:::info

响应数据默认会被缓存。若您不需要缓存响应，请提前调用 [`clearCache()`](/guide/packages/client/updateManager/clearCache.html)。

:::

## 参数

无

## 返回值

```typescript
Promise<boolean>;
```

## 代码示例

```typescript
import { getUpdateManager } from "@herina-rn/client";

const manager = getUpdateManager();

await manager.checkForUpdate();
```
