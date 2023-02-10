# 资源文件更新

Herina 支持对资源文件进行更新。只要是 `Metro` 支持的资源文件，这些文件都可以进行热更新。

资源文件更新与代码更新方式相同，只需调用 `requestUpdate` 即可。

## 原理

所有通过 `require` 导入的静态文件，都会在 Bundle 构建时，被转为一个 JS 对象，里面记录了文件的名字、 Hash、类型、位置等信息，并注册到 React Native 内置的 `AssetRegistry`。

`AssetRegistry` 的工作特别简单，它会为注册的资源文件分配一个 Asset ID，通过此 ID 可以向它获取文件信息。（相当于 Key-Value 数据类型）

以 React Native 自带的 Image 组件加载图片为例，当我们使用 `require` 导入图片并传递到 `source` prop 时，经过构建后，实际传入 `source` 的是 Asset ID。

通过 Asset ID，Image 组件会向 `AssetRegistry` 获取资源文件信息对象，并通过分析信息，向这个对象插入 `uri` 属性，这个属性代表的资源文件在系统的路径。原生组件将通过 `uri` 找到图片，并将其进行加载。

Herina 在这里的设计与实现很巧妙，它会在构建更新时，找出发生变化的资源文件，并在它在经过 Bundle 时，拦截向 `AssetRegistry` 注册的过程，直接返回文件信息对象，而不是 Asset ID。在运行时， `@herina-rn/client` 会生成 `uri` 并插入文件信息对象，直接跳过了 Image 组件内部分析 `uri` 的过程。