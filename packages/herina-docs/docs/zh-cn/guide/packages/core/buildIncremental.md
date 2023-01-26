# buildIncremental()

构建一个递增式更新。
Builds an incremental update.

若之前已构建了 `version.json`，此函数还会写入最新的版本信息。s built before, this function will also write the latest version info to it.

:::warning

请确保你的项目为 Git 仓库。具体可参考[递增式更新](/zh-cn/guide/update/incremental.html)。

:::

## 参数

| 参数名 | 必填 | 类型                                               | 默认值 | 备注 |
| ------ | ---- | -------------------------------------------------- | ------ | ---- |
| config | YES  | [`HerinaConfig`](/zh-cn/configuration/global.html) | /      | /    |

## 返回值

返回输出文件的地址。

```typescript
Promise<string>;
```

## 代码示例

```typescript
import {buildIncremental, defineHerinaConfig} from '@herina-rn/core';

const config = defineHerinaConfig({ ... });

const filePath = buildIncremental(config);
```
