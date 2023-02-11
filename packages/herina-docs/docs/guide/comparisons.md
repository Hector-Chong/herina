# 比较

## CodePush

准确来说，CodePush 与 Herina 是不可相提并论的事物。CodePush 主要为 App 提供闭环式的构建、测试、构建、监控等基建服务；而 Herina 是为 React Native 量身定制的，只提供 Bundle 的构建与管理功能。这就像把 Vercel 与 Vite 进行比较，这是不恰当的。

如果只从构建与更新 Bundle 的角度出发，Herina 相较于 CodePush 提供了 Bundle 拆分、增量更新、动态模块引入与自定义 Bundle 等功能。而且 Herina 更关注开发者体验，尤其是自身不具备或不完全具备原生开发能力的技术人员，提供的配置与接口都是基于 JavaScript 的，轻量且简单易用，极大减轻技术人员的学习成本与心智负担。

此外，如果您是为中国大陆用户提供服务，CodePush 的海外服务更新 Bundle 的速度可能较为堪忧。而 Herina 可以让您将 Bundle 上传到 CDN，并且还可以在运行时修改 CDN 地址。

## metro-code-split

[`metro-code-split`](https://github.com/wuba/metro-code-split) 是由 58 同城技术团队开发的 Bundle 拆分工具。

总体来说，此工具并不完善。文档内容少之又少，接口层面令人困惑且繁琐，以及版本兼容性不佳。更重要的是，从 GitHub 的提交记录来看，似乎维护积极性并不高。

在热更新方面，[`metro-code-split`](https://github.com/wuba/metro-code-split) 不具备此能力，因为它仅仅作为一个 Bundle 拆分工具。而 Herina 提供了 Android 与 iOS 平台热更新客户端，仅需对原生代码进行简单的修改，就能轻松上线热更新功能。