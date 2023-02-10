# getUpdateManager

获取 [UpdateManager](/guide/packages/client/updateManager/introduction.html) 实例，此实例和 [`registerUpdateManager`](/guide/packages/client/registerUpdateManager.html) 返回值相同。

:::warning

此函数不可在 [`registerUpdateManager`](/guide/packages/client/registerUpdateManager.html) 之前调用。

:::

## 参数

无

## 返回值

```typescript
typeof UpdateManager;
```

## 代码示例

```typescript
import { registerUpdateManager, getUpdateManager } from "@herina-rn/client";

registerUpdateManager("https://hector.im");

const manager = getUpdateManager();
```
