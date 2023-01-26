# setUseOriginalBundle()

决定是否要使用原始 Bundle。

## 参数

| 参数名 | 必填 | 类型    | 默认值 | 备注 |
| ------ | ---- | ------- | ------ | ---- |
| use    | 是   | boolean | /      | App  |

## 返回值

```typescript
Promise<boolean>;
```

## 代码示例

```typescript
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager();

const restoreToOriginal = async () => {
  return manager.setUseOriginalBundle(true);
};

await restoreToOriginal();
```
