package com.hectorchong.herina;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

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

  @Override
  public Map<String, Object> getConstants() {
    return moduleImpl.getConstants();
  }

  @ReactMethod
  public void initVersionJson(ReadableMap params, Callback callback) {
    moduleImpl.initVersionJson(params, callback);
  }

  @ReactMethod
  public void getVersionConfig(Callback callback) {
    moduleImpl.getVersionConfig(callback);
  }

  @ReactMethod
  public void setVersionConfigValues(ReadableMap params, Callback callback) {
    moduleImpl.setVersionConfigValues(params, callback);
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
  public void applyFullUpdate(Callback callback) {
    moduleImpl.applyFullUpdate(callback);
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
