package com.hectorchong.herina.models;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class AppVersionConfig {
  private int useOriginal;
  private int originalVersionNum;
  private String originalCommitHash;
  private int versionNum;
  private String commitHash;
  private int isIncrementalAvailable;
  private JSONArray incrementalsToApply;

  public boolean getUseOriginal() {
    return useOriginal == 1;
  }

  public void setUseOriginal(int useOriginal) {
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

  public boolean getIsIncrementalAvailable() {
    return isIncrementalAvailable == 1;
  }

  public void setIsIncrementalAvailable(int isIncrementalAvailable) {
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
      config.setUseOriginal(dictionary.getInt("useOriginal"));
      config.setVersionNum(dictionary.getInt("versionNum"));
      config.setCommitHash(dictionary.getString("commitHash"));
      config.setOriginalCommitHash(dictionary.getString("originalCommitHash"));
      config.setOriginalVersionNum(dictionary.getInt("originalVersionNum"));
      config.setIsIncrementalAvailable(dictionary.getInt("isIncrementalAvailable"));
      config.setIncrementalsToApply(dictionary.getJSONArray("incrementalsToApply"));
    } catch (JSONException e) {
      e.printStackTrace();

      return null;
    }

    return config;
  }

  public JSONObject getJsonObject() {
    JSONObject object = new JSONObject();

    try {
      object.put("useOriginal", useOriginal);
      object.put("versionNum", versionNum);
      object.put("commitHash", commitHash);
      object.put("originalCommitHash", originalCommitHash);
      object.put("originalVersionNum", originalVersionNum);
      object.put("isIncrementalAvailable", isIncrementalAvailable);
      object.put("incrementalsToApply", incrementalsToApply);
    } catch (JSONException e) {
      e.printStackTrace();

      return null;
    }

    return object;
  }

  public WritableMap getWritableMap() {
    WritableMap object = Arguments.createMap();

    ArrayList<String> incrementalsToApplyArr = new ArrayList<>();

    try {
      for (int i = 0; i < incrementalsToApply.length(); i++) {
        incrementalsToApplyArr.add(incrementalsToApply.getString(i));
      }
    } catch (JSONException e) {
      e.printStackTrace();

      return null;
    }

    object.putInt("useOriginal", useOriginal);
    object.putInt("versionNum", versionNum);
    object.putString("commitHash", commitHash);
    object.putString("originalCommitHash", originalCommitHash);
    object.putInt("originalVersionNum", originalVersionNum);
    object.putInt("isIncrementalAvailable", isIncrementalAvailable);
    object.putArray("incrementalsToApply", Arguments.fromList(incrementalsToApplyArr));

    return object;
  }
}
