package com.hectorchong.herina;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class AppCapacityModule extends ReactContextBaseJavaModule {
  private AppCapacityImpl moduleImpl;

  AppCapacityModule(ReactApplicationContext context) {
    super(context);

    moduleImpl = new AppCapacityImpl(context);
  }

  @Override
  public String getName() {
    return AppCapacityImpl.NAME;
  }

  @ReactMethod
  public void initVersionJson(ReadableMap params, Callback callback) {
    moduleImpl.initVersionJson(params, callback);
  }

  @ReactMethod
  public void getCurrentVersion(Callback callback) {
    moduleImpl.getCurrentVersion(callback);
  }

  @ReactMethod
  public void recordNewestVersion(ReadableMap params, Callback callback) {
    moduleImpl.recordNewestVersion(params, callback);
  }

  @ReactMethod
  public void downloadBundleToUpdate(ReadableMap params, Callback callback) {
    moduleImpl.downloadBundleToUpdate(params, callback);
  }

  @ReactMethod
  public void downloadIncrementalUpdates(ReadableMap params, Callback callback) {
    moduleImpl.downloadIncrementalUpdates(params, callback);
  }

  @ReactMethod
  public void applyBundleUpdate(Callback callback) {
    moduleImpl.applyBundleUpdate(callback);
  }

  @ReactMethod
  public void applyIncrementalUpdate(Callback callback) {
    moduleImpl.applyIncrementalUpdate(callback);
  }

  @ReactMethod
  public void setUseOriginalBundle(ReadableMap params, Callback callback) {
    moduleImpl.setUseOriginalBundle(params, callback);
  }

  @ReactMethod
  public void reloadApp() {
    moduleImpl.reloadApp();
  }
}
