# applyUpdate()

应用所下载的更新包。

## 参数

| 参数名    | 必填 | 类型    | 默认值  | 备注                   |
| --------- | ---- | ------- | ------- | ---------------------- |
| immediate | 否   | boolean | `false` | 应用更新后是否重载 App |

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
