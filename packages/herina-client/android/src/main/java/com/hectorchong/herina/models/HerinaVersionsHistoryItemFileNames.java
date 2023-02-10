package com.hectorchong.herina.models;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;
import org.json.JSONObject;

public class HerinaVersionsHistoryItemFileNames {
  private String main;
  private String incremental;
  private String vendor;

  public String getMain() {
    return main;
  }

  public void setMain(String main) {
    this.main = main;
  }

  public String getIncremental() {
    return incremental;
  }

  public void setIncremental(String incremental) {
    this.incremental = incremental;
  }

  public String getVendor() {
    return vendor;
  }

  public void setVendor(String vendor) {
    this.vendor = vendor;
  }

  public static HerinaVersionsHistoryItemFileNames initWithDictionary(ReadableMap dictionary) {
    HerinaVersionsHistoryItemFileNames instance = new HerinaVersionsHistoryItemFileNames();

    instance.setMain(dictionary.getString("main"));
    instance.setIncremental(dictionary.getString("incremental"));
    instance.setVendor(dictionary.getString("vendor"));

    return instance;
  }

  public static HerinaVersionsHistoryItemFileNames initWithJsonObject(JSONObject jsonObject) {
    HerinaVersionsHistoryItemFileNames instance = new HerinaVersionsHistoryItemFileNames();

    try{
      instance.setMain(jsonObject.getString("main"));
      instance.setIncremental(jsonObject.getString("incremental"));
      instance.setVendor(jsonObject.getString("vendor"));
    }catch (JSONException e){
      e.printStackTrace();

      return null;
    }

    return instance;
  }

  public ReadableMap getReadbleMap() {
    WritableMap map = Arguments.createMap();

    map.putString("main", getMain());
    map.putString("incremental", getIncremental());
    map.putString("vendor", getVendor());

    return map;
  }
}
