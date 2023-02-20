# 配置

Herina 需要您对 Bundle 管理部分的原生代码进行修改。如果这对您来说是比较困难的，您可以参考 [`案例文件`](https://github1s.com/Hector-Chong/herina/blob/HEAD/packages/herina-client/example) 。

## Android

::: warning
在修改代码之前，请确保已安装 `@herina-rn/client`，并且使用 Gradle 对项目进行了同步。否则，您可能会遇到错误。
:::

::: details 如何使用 Gradle 同步项目

在 `android` 目录执行以下命令：

```bash
./gradlew build
```

或者使用 Android Studio 打开 `android` 目录，点击菜单栏 `File / Sync Project With Gradle Files`.

:::

### 旧架构

首先在 `android` 目录找到 `MainApplication.java`。

然后从 Herina 包导入 `BundleManager`。

```java
package com.project.name;

import android.app.Application;
import android.content.Context;

import com.hectorchong.herina.BundleManager; // [!code ++]
```

找到名为 `mReactNativeHost` 带有 `final` 修饰符的私有属性，并使用以下代码在里面创建一个名为 `getJSBundleFile` 的方法。

```java
public class MainApplication extends Application implements ReactApplication {
  private final ReactNativeHost mReactNativeHost =
    new ReactNativeHost(this) {
      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      protected List<ReactPackage> getPackages() {
        @SuppressWarnings("UnnecessaryLocalVariable")
        List<ReactPackage> packages = new PackageList(this).getPackages();

        return packages;
      }

      @Override
      protected String getJSMainModuleName() {
        return "index";
      }

      @Nullable // [!code ++]
      @Override // [!code ++]
      protected String getJSBundleFile() { // [!code ++]
        return BundleManager.getBundleURL(MainApplication.this, BuildConfig.DEBUG); // [!code ++]
      } // [!code ++]
};
```

### 新架构

首先在 `android` 目录找到 `MainApplicationReactNativeHost.java`。

然后从 Herina 包导入 `BundleManager`。

```java
package com.project.name;

import android.app.Application;
import android.content.Context;

import com.hectorchong.herina.BundleManager; // [!code ++]
```

最后，使用以下代码在里面创建一个名为 `getJSBundleFile` 的方法。

```java
public class MainApplicationReactNativeHost extends ReactNativeHost {
  public MainApplicationReactNativeHost(Application application) {
    super(application);
  }

  @Nullable // [!code ++]
  @Override // [!code ++]
  protected String getJSBundleFile() { // [!code ++]
    return BundleManager.getBundleURL(getApplication(), BuildConfig.DEBUG); // [!code ++]
  } // [!code ++]
  // ..
};
```

## iOS

### 原生项目

::: warning
在修改代码之前，请确保已安装 `@herina-rn/client`，并执行了 `pod install`。否则，您可能会遇到错误。
:::

首先打开 `ios` 目录的 `AppDelegate.m` 或 `AppDelegate.mm`。

从文件顶部导入 `RNHerina/BundleManager.h`。

```objective-c
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#import <React/RCTAppSetupUtils.h>

#import "RNHerina/BundleManager.h" // [!code focus]

@implementation AppDelegate

```

找到名为 `sourceURLForBridge` 的方法，并使用以下代码重写实现。

```objective-c
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [BundleManager getBundleURL];
}
```

### Expo

若要将 Herina 引入 Expo 项目，它的操作与[原生项目](/guide/configuration.html#原生项目)别无二致。

若您在引入时发生了错误，请确保 `AppDelegate.h` 只存在一个 `@interface`。

## JavaScript

找到项目根目录的 `metro.config.js` 文件，替换为以下内容：

```javascript
const { createMetroConfig, isAppBuilding } = require("@herina-rn/core");
const herinaConfig = require("./herina.config");

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
};

module.exports = (_, isBuilding) => {
  isBuilding = typeof isBuilding === "undefined" ? isAppBuilding() : isBuilding;

  return isBuilding ? createMetroConfig(herinaConfig, config, true) : config;
};
```
