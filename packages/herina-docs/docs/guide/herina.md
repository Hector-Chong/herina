# Herina

**Build bundle with Herina.**

## 介绍

Herina 是为 React Native App 提供动态化能力的开发套件。通过提供简单易用的 JS API，为您能够轻而易举地为 App 加入热更新功能。并且，您还可以使用 `import()` 从远程服务器动态导入模块，使用此项功能无需额外配置。

在底层，Herina 使用 Metro 作为 Bundle 构建工具。它们之间的关系就像 Vite 之于 Rollup 或 ESBuild。当构建完成之后，Herina 生成 Bundle 的 AST 分析代码，并将里面的模块拆分到不同类型的 Chunk 内。

## 功能

- Bundle 构建
- 将 Bundle 拆分为 Chunk
- 资源文件更新
- 使用 `import()` 动态导入模块
- 构建和应用增量、全量更新
- 简单易用的 JS API
- 当发生错误时，自动回滚 Bundle
- 支持 iOS 与 Android
- 支持 TypeScript

## 安装

```tsx
yarn add @herina-rn/core @herina-rn/client
cd ios && pod install
```

## 代码拆分

Herina 将 Bundle 拆分为三种不同的 Chunk：

- 业务包: 包含 App 的业务代码与资源文件；
- 动态包: 包含使用 `import(...)` 导入的模块；
- 基础包: 包含 `node_modules` 内的依赖与 Herina 运行时

## 使用

在更新之前，请先调用 `registerUpdateManager` 注册 `UpdateManager`。第一个参数是可选的，它代表的是所访问资源（通常为生成的 Bundle、Chunk）的 Base URL，若此参数未被定义，将读取原始 Bundle 内的 Base URL。

```tsx
import { registerUpdateManager } from "@herina-rn/client";

const manager = registerUpdateManager("https://hector.im");
```

之后分别调用 `requestUpdate` 与 `applyUpdate`，以下载更新包并应用更新。

```tsx
import { getUpdateManager } from "@herina-rn/client";

const onUpdateBundle = async () => {
  // 已调用 `registerUpdateManager`
  const manager = getUpdateManager();

  await manager.requestUpdate();

  // 若此参数为 true，将在 Bundle 替换后重载 App
  manager.applyUpdate(true);
};
```

没错，就是这么简单。三行代码轻松搞定 React Native 热更新。

## 使用要求

为使用 Herina，您的项目必须为 Git 仓库，因为 Herina 通过读取项目的 Commit 记录比对文件以构建更新包。

## 使用限制

目前，Herina 仅限用于生产模式，并且不会输出 Sourcemap。若您正在使用如 Sentry 这样的性能监控，我正在开发为它提供支持。

## 联系 & 支持

Herina 按现状提供。供您参考，Herina 目前是我工作的一部分，但这不意味这是永久性的。如果我被安排到其它工作，我将仍尽量抽出时间提供技术支持。

不必犹豫提交 Issue 或 Pull Request。如果您有想法要和我分享，您可以[**联系我**](mailto:i@hector.im)，我会尽快回复。

## License

MIT
