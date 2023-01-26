# applyIncrementalUpdate()

生成一个新 Bundle 并替换原始的 Bundle。

## 参数

| 参数名    | 必填 | 类型    | 默认值  | 备注                      |
| --------- | ---- | ------- | ------- | ------------------------- |
| immediate | 否   | boolean | `false` | Bundle 替换后是否重载 App |

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
    await manager.requestIncrementalUpdates();

    await manager.applyIncrementalUpdate(true);
  } else {
    Alert.alert("No need to update.");
  }
};

await updateBundle();
```
