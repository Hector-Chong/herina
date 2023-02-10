package com.hectorchong.herina.models;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.hectorchong.herina.utils.JsonUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AppVersionConfig {
  private boolean useOriginal;
  private int originalVersionNum;
  private String originalCommitHash;
  private int versionNum;
  private String commitHash;
  private int nextVersionNum;
  private String nextCommitHash;
  private boolean isFullAvailable;
  private boolean isIncrementalAvailable;
  private JSONArray incrementalsToApply;
  private HerinaVersionsHistoryItem fullToApply;
  private JSONArray appliedVersionNums;

  public boolean isUseOriginal() {
    return useOriginal;
  }

  public void setUseOriginal(boolean useOriginal) {
    this.useOriginal = useOriginal;
  }

  public boolean getIsFullAvailable() {
    return isFullAvailable;
  }

  public void setIsFullAvailable(boolean fullAvailable) {
    isFullAvailable = fullAvailable;
  }

  public boolean isIncrementalAvailable() {
    return isIncrementalAvailable;
  }

  public HerinaVersionsHistoryItem getFullToApply() {
    return fullToApply;
  }

  public void setFullToApply(HerinaVersionsHistoryItem fullToApply) {
    this.fullToApply = fullToApply;
  }

  public JSONArray getAppliedVersionNums() {
    return appliedVersionNums;
  }

  public void setAppliedVersionNums(JSONArray appliedVersionNums) {
    this.appliedVersionNums = appliedVersionNums;
  }

  public boolean getUseOriginal() {
    return useOriginal;
  }

  public void setUseOriginal(Boolean useOriginal) {
    this.useOriginal = useOriginal;
  }

  public String getOriginalCommitHash() {
    return originalCommitHash;
  }

  public void setOriginalCommitHash(String originalCommitHash) {
    this.originalCommitHash = originalCommitHash;
  }

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

  public int getNextVersionNum() {
    return nextVersionNum;
  }

  public void setNextVersionNum(int nextVersionNum) {
    this.nextVersionNum = nextVersionNum;
  }

  public String getNextCommitHash() {
    return nextCommitHash;
  }

  public void setNextCommitHash(String nextCommitHash) {
    this.nextCommitHash = nextCommitHash;
  }

  public boolean getIsIncrementalAvailable() {
    return isIncrementalAvailable;
  }

  public void setIsIncrementalAvailable(boolean isIncrementalAvailable) {
    this.isIncrementalAvailable = isIncrementalAvailable;
  }

  public JSONArray getIncrementalsToApply() {
    return incrementalsToApply;
  }

  public void setIncrementalsToApply(JSONArray incrementalsToApply) {
    this.incrementalsToApply = incrementalsToApply;
  }

  public int getOriginalVersionNum() {
    return originalVersionNum;
  }

  public void setOriginalVersionNum(int originalVersionNum) {
    this.originalVersionNum = originalVersionNum;
  }

  public static AppVersionConfig initWithJSON(JSONObject dictionary) {
    AppVersionConfig config = new AppVersionConfig();

    try {
      config.setUseOriginal(dictionary.getBoolean("useOriginal"));
      config.setVersionNum(dictionary.getInt("versionNum"));
      config.setCommitHash(dictionary.getString("commitHash"));
      config.setNextVersionNum(dictionary.getInt("nextVersionNum"));
      config.setNextCommitHash(dictionary.getString("nextCommitHash"));
      config.setOriginalCommitHash(dictionary.getString("originalCommitHash"));
      config.setOriginalVersionNum(dictionary.getInt("originalVersionNum"));
      config.setIsIncrementalAvailable(dictionary.getBoolean("isIncrementalAvailable"));
      config.setIncrementalsToApply(dictionary.getJSONArray("incrementalsToApply"));
      config.setIsFullAvailable(dictionary.getBoolean("isFullAvailable"));

      if (!dictionary.isNull("fullToApply")) {
        config.setFullToApply(HerinaVersionsHistoryItem.initWithJsonObject(dictionary.getJSONObject("fullToApply")));
      }
    } catch (JSONException e) {
      e.printStackTrace();

      return null;
    }

    return config;
  }

  public JSONObject getJsonObject() {
    JSONObject object = new JSONObject();

    try {
      object.put("useOriginal", getUseOriginal());
      object.put("versionNum", getVersionNum());
      object.put("commitHash", getCommitHash());
      object.put("nextVersionNum", getNextVersionNum());
      object.put("nextCommitHash", getNextCommitHash());
      object.put("originalCommitHash", getOriginalCommitHash());
      object.put("originalVersionNum", getOriginalVersionNum());
      object.put("isFullAvailable", getIsFullAvailable());
      object.put("isIncrementalAvailable", getIsIncrementalAvailable());
      object.put("incrementalsToApply", getIncrementalsToApply());
      object.put("appliedVersionNums", getAppliedVersionNums());
      object.put("fullToApply", fullToApply != null ? fullToApply.getJsonObject() : null);
    } catch (JSONException e) {
      e.printStackTrace();

      return null;
    }

    return object;
  }

  public WritableMap getWritableMap() {
    WritableMap object = Arguments.createMap();

    object.putBoolean("useOriginal", getUseOriginal());
    object.putInt("versionNum", getVersionNum());
    object.putString("commitHash", getCommitHash());
    object.putInt("nextVersionNum", getNextVersionNum());
    object.putString("nextCommitHash", getNextCommitHash());
    object.putString("originalCommitHash", getOriginalCommitHash());
    object.putInt("originalVersionNum", getOriginalVersionNum());
    object.putBoolean("isFullAvailable", getIsFullAvailable());
    object.putBoolean("isIncrementalAvailable", getIsIncrementalAvailable());
    object.putArray("incrementalsToApply", incrementalsToApply == null ? null : Arguments.fromList(JsonUtils.jsonArrayToArrayList(incrementalsToApply)));
    object.putArray("appliedVersionNums", appliedVersionNums == null ? null : Arguments.fromList(JsonUtils.jsonArrayToArrayList(appliedVersionNums)));
    object.putMap("fullToApply", fullToApply == null ? null : fullToApply.getReadbleMap());

    return object;
  }
}
