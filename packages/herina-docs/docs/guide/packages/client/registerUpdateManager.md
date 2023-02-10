# registerUpdateManager()

返回 [UpdateManager](/guide/packages/client/updateManager/introduction.html) 的单例.

## 参数

| 参数名  | 必填 | 类型   | 默认值 | 备注 |
| ------- | ---- | ------ | ------ | ---- |
| baseUrl | NO   | string | /      | /    |

## 返回值

```typescript
typeof UpdateManager;
```

## 代码示例

```typescript
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager("https://hector.im");
```
