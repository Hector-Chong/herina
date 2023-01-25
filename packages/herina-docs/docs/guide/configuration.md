# Configuration

## Code Modifications

Herina requires you to modify the native code for managing bundle. If you find it difficult to do, you may refer to the examples.

## Android

::: warning
Before modifying the code, make sure you've installed `@herina/client` and sync your project with Gradle, otherwise an error may be encountered.
:::

### Legacy Architecture

First, find `MainApplication.java` inside `android` folder.

And import `BundleManager` from the packge of Herina.

```java
package com.project.name;

import android.app.Application;
import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;

import com.hectorchong.herina.BundleManager; // [!code ++]
```

Find the private and final property named `mReactNativeHost`, and create a method called `getJSBundleFile` with the code below.

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

### New Architecture

First, find `MainApplicationReactNativeHost.java` inside `android` folder.

And import `BundleManager` from the packge of Herina.

```java
package com.project.name;

import android.app.Application;
import android.content.Context;

import androidx.annotation.Nullable;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;

import com.hectorchong.herina.BundleManager; // [!code ++]
```

Finally, create a method called `getJSBundleFile` with the code below.

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

::: warning
Before modifying the code, make sure you've installed `@herina/client` and executed `pod install`, otherwise an error may be encountered.
:::

First, open `AppDelegate.m` or `AppDelegate.mm` inside `ios` foloder.

Import `RNHerina/BundleManager.h` at the top of the file.

```objective-c
#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>

#import <React/RCTAppSetupUtils.h>

#import "RNHerina/BundleManager.h" // [!code focus]

@implementation AppDelegate

```

Find the method named `sourceURLForBridge`, and overwrite it with the code below.

```objective-c
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [BundleManager getBundleURL];
}
```
