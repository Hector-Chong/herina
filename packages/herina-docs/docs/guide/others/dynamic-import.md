# Dynamic Import

You can use dynamic import with Herina. It's exactly the same how you use `import()` with `Webpack` or `Vite`.

## Load Remote Module

Let's say you have a function requiring a module to excuse.

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

When `onCallDynamic` is called, you will see an alert on the screen.

## React Suspense API

Of course, Herina gives you the ability to use `Suspense` API and lazily load component.

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

## How does it work?

Although React Native does not support this feature by default, we know [`Metro`](https://facebook.github.io/metro) as React Native's bundler giving us the [API](https://facebook.github.io/metro/docs/configuration/#transformer-options) to make it happen.

Based on this [API](https://facebook.github.io/metro/docs/configuration/#transformer-options), Herina creates its own runtime similar to Webpack to resolve remote modules.