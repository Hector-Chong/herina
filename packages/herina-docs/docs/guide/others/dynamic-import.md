# 动态 Import

使用 Herina，您可以动态引入模块。它的调用方式就和您在 `Webpack` 或 `Vite` 使用 `import()` 一样。

## 加载远程模块

假设您要引入一个模块并执行。

:::code-group

```typescript [App.tsx]
const onCallDynamic = async () => {
    const {dynamicFunction} = await import('./dynamic');

    dynamicFunction();
};
```

```typescript [dynamic.ts]
import {Alert} from 'react-native';

export const dynamicFunction = () => {
    Alert.alert('Hello World.');
};
```

:::

当 `onCallDynamic` 被调用时，您会在屏幕上看到提示框。

## React Suspense API

当然，Herina 为您提供了使用 `Suspense` API 的能力以及懒加载组件。

:::code-group

```tsx [App.tsx]
import {lazy, Suspense, useEffect} from 'react';

const LazyComponent = lazy(() => import('./dynamic-import'));

const App = () => {
  useEffect(() => {
    registerUpdateManager('https://hector.im');
  }, []);

  return (
    <View>
      <Suspense>
        <LazyComponent />
      </Suspense>
    </View>
  );
};

export default App;
```

```tsx [dynamic-import.tsx]
import {Text} from 'react-native';

const DynamicImportComponent = () => {
  return <Text>I'm loaded from outside.</Text>;
};

export default DynamicImportComponent;
```

:::

## 实现原理

尽管 React Native 默认并不支持此功能，但我们知道 [`Metro`](https://facebook.github.io/metro) 是 React Native 的构建工具，为我们提供了 [API](https://facebook.github.io/metro/docs/configuration/#transformer-options) 来实现这一功能。

基于这个 [API](https://facebook.github.io/metro/docs/configuration/#transformer-options)，Herina 创建了自己的运行时，这和 Webpack 处理远程模块的方法相似。