package com.hectorchong.herina.models;

import com.facebook.react.bridge.ReadableMap;

public class HerinaVersionsHistoryItem {
  private int versionNum;
  private String commitHash;
  private String filePath;

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

  public String getFilePath() {
    return filePath;
  }

  public void setFilePath(String filePath) {
    this.filePath = filePath;
  }

  public static HerinaVersionsHistoryItem initWithDictionary(ReadableMap dictionary){
    HerinaVersionsHistoryItem item = new HerinaVersionsHistoryItem();

    item.setCommitHash(dictionary.getString("commitHash"));
    item.setVersionNum(dictionary.getInt("versionNum"));
    item.setFilePath(dictionary.getString("filePath"));

    return item;
  }
}
