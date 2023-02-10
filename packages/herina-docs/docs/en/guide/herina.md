# Herina

**Build bundle with Herina.**

## Introduction

Herina is a toolkit providing dynamic ability for React Native App. It provides simple JS APIs that you can easily integrate hot-update into your App. Also, you can use `import()` to dynamically import modules from remote without any configuration with Herina.

Under the hood, Herina has Metro as bundler to build bundle. It is like Vite to Rollup or ESBuild. After the build is done, it generates AST of the bundle to analyse the code to separate modules into different kinds of chunks.

## Features

- Build bundle
- Split bundle into chunks
- Dynamic import
- Build and apply incremental updates
- Easy to use JS APIs
- Auto-restore bundle when error appears
- iOS and Android support
- TypeScript support

## Installation

```tsx
yarn add @herina-rn/core @herina-rn/client
cd ios && pod install
```

## Code Splitting

Herina divides bundle into three types of chunks:

- Business: includes the business code of the App.
- Dynamic: includes a module imported by using `import(...)`.
- Vendor: includes dependencies in `node_modules` and Herina’s runtime.

## Usage

There are two types of updates: full and incremental updates.

Before updating, you must register `UpdateManager` by invoking `registerUpdateManager`. The first argument indicating the base URL for your resources to be downloaded is optional. If this argument is undefined, it will read base URL from the original bundle.

```tsx
import {registerUpdateManager} from '@herina-rn/client';

const manager = registerUpdateManager('https://hector.im');
```

### Full

By the full update, the new bundle from your server will be downloaded and replaces the original one.

```tsx
import {getUpdateManager} from '@herina-rn/client';

const onUpdateBundle = async () => {
		// After invoking `registerUpdateManager`
    const manager = getUpdateManager();

    await manager.requestUpdate();

		// If the argument is true, the App will reload after the bundle is replaced.
    manager.applyUpdate(true);
};
```

### Incremental

By the incremental update, the runtime sends a request to know what incremental update is available, and downloads them to generate a new bundle to replace the original one.

```tsx
import {getUpdateManager} from '@herina-rn/client';

const onUpdateByIncremental = async () => {
    const manager = getUpdateManager();

    await manager.requestIncrementalUpdates();

    manager.applyIncrementalUpdate(true);
};
```

## Requirement

To use Herina, you should modify the native code. If you have no exeperience in iOS or Android development, You might refer to the `configuration` in the docs.

## Limitation

Currently, Herina only works on production mode and does not output sourcemaps. If you are using a performance profiler like Sentry, I’m working on it to provide support.

## Contact & Support

Herina is provided *as is.* For your information, Herina is part of my work now, but it does not mean this is permanent. I will try to find time to provide technical support if I am transferred to another task.

Do not hesitate to open an issue or pull reqeust. If you have some ideas to share with me, you may [**contact me**](https://www.notion.so/AutoLayout-3d45b0277a2e4b9d9d3d01c83b4df4e0) and I will reply asap.

## License

MIT