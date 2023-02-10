package com.hectorchong.herina.models;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.hectorchong.herina.utils.JsonUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class HerinaVersionsHistoryItem {
  private int versionNum;
  private String commitHash;
  private String lastCommitHash;
  private HerinaVersionsHistoryItemFileNames fileNames;
  private HashMap<String, Object> assets;

  public int getVersionNum() {
    return versionNum;
  }

  public void setVersionNum(int versionNum) {
    this.versionNum = versionNum;
  }

  public String getCommitHash() {
    return commitHash;
  }

  public void setCommitHash(String commitHash) {
    this.commitHash = commitHash;
  }

  public String getLastCommitHash() {
    return lastCommitHash;
  }

  public void setLastCommitHash(String lastCommitHash) {
    this.lastCommitHash = lastCommitHash;
  }

  public HerinaVersionsHistoryItemFileNames getFileNames() {
    return fileNames;
  }

  public void setFileNames(HerinaVersionsHistoryItemFileNames fileNames) {
    this.fileNames = fileNames;
  }

  public HashMap<String, Object> getAssets() {
    return assets;
  }

  public void setAssets(HashMap<String, Object> assets) {
    this.assets = assets;
  }

  public static HerinaVersionsHistoryItem initWithDictionary(ReadableMap dictionary) {
    HerinaVersionsHistoryItem item = new HerinaVersionsHistoryItem();

    item.setCommitHash(dictionary.getString("commitHash"));
    item.setVersionNum(dictionary.getInt("versionNum"));
    item.setLastCommitHash(dictionary.getString("lastCommitHash"));
    item.setFileNames(HerinaVersionsHistoryItemFileNames.initWithDictionary(dictionary.getMap("fileNames")));
    item.setAssets(dictionary.getMap("assets").toHashMap());

    return item;
  }

  public static HerinaVersionsHistoryItem initWithJsonObject(JSONObject object) throws JSONException {
    HerinaVersionsHistoryItem item = new HerinaVersionsHistoryItem();

    item.setCommitHash(object.getString("commitHash"));
    item.setVersionNum(object.getInt("versionNum"));
    item.setLastCommitHash(object.getString("lastCommitHash"));
    item.setFileNames(HerinaVersionsHistoryItemFileNames.initWithJsonObject(object.getJSONObject("fileNames")));
    item.setAssets((HashMap<String, Object>) JsonUtils.jsonObjectToMap(object.getJSONObject("assets")));

    return item;
  }

  public ReadableMap getReadbleMap() {
    WritableMap map = Arguments.createMap();

    map.putInt("versionNum", getVersionNum());
    map.putString("commitHash", getCommitHash());
    map.putString("lastCommitHash", getLastCommitHash());
    map.putMap("fileNames", getFileNames().getReadbleMap());
    map.putMap("assets", Arguments.makeNativeMap(getAssets()));

    return map;
  }

  public JSONObject getJsonObject() {
    JSONObject jsonObject = new JSONObject();

    try {
      jsonObject.put("versionNum", getVersionNum());
      jsonObject.put("commitHash", getCommitHash());
      jsonObject.put("lastCommitHash", getLastCommitHash());
      jsonObject.put("fileNames", getFileNames().getReadbleMap());
      jsonObject.put("assets", getAssets());
    } catch (JSONException e) {
      e.printStackTrace();

      return null;
    }

    return jsonObject;
  }
}
