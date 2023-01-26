# buildVersionsJson()

构建 [`versions.json`](/zh-cn/guide/concepts.html#versions-json) 并放置在特定地址。

## 参数

| 参数名 | 必填 | 类型                                               | 默认值 | 备注 |
| ------ | ---- | -------------------------------------------------- | ------ | ---- |
| config | YES  | [`HerinaConfig`](/zh-cn/configuration/global.html) | /      | /    |

## 返回值

返回 `version.json` 的存储地址。

```typescript
Promise<string>;
```

## 代码示例

```typescript
import {buildVersionsJson, defineHerinaConfig} from '@herina-rn/core';

const config = defineHerinaConfig({ ... });

const filePath = buildVersionsJson(config);
```
