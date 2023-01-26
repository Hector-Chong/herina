# build()

为全量更新构建 Chunk。

若之前已构建了 `version.json`，此函数还会写入最新的版本信息。

## 参数

| 参数名 | 必填 | 类型                                         | 默认值 | 备注 |
| ------ | ---- | -------------------------------------------- | ------ | ---- |
| config | YES  | [`HerinaConfig`](/zh-cn/configuration/global.html) | /      | /    |

## 返回值

```typescript
Promise<Record<string, ChunkAsset[]>>;
```

```typescript
interface ChunkAsset {
  filename: string;
  code: string;
  path: string;
}
```

## 代码示例

```typescript
import {build, defineHerinaConfig} from '@herina-rn/core';

const config = defineHerinaConfig({ ... });

build(config);
```
