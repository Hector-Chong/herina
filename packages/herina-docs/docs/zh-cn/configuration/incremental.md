# 递增式更新配置

通过添加 `incremental` 属性配置。

```typescript
import { defineHerinaConfig } from "@herina-rn/core";

export default defineHerinaConfig({
  environment: "production",
  baseUrl: "https://hector.im",
  //...

  // 递增式更新相关配置
  incremental: {
    previousCommitHash: "",
    currentCommitHash: "",
    pure: false,
    filePath: ""
  }
});
```

## previousCommitHash

- 类型：`string`
- 默认值：上一个 Commit 的哈希值

从某一个 Commit 开始构建递增式更新。

## currentCommitHash

- 类型：`string`
- 默认值：当前 Commit 的哈希值

截止到某一个 Commit 构建递增式更新。

## pure

- 类型：`boolean`
- 默认值：`false`

此配置项与 `incremental.filePath` 搭配使用。如果为 `true`，在递增式更新构建完后，版本信息不会被写入 `versions.json`，输出的文件会被存放在 `incremental.filePath` 指定的路径。

## filePath

- 类型：`string`
- 默认值：`''`

当 `incremental.pure` 为 `true`，输出的递增式更新文件存放路径。
