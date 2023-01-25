package com.hectorchong.herina.utils;

import android.content.Context;

import com.facebook.react.bridge.ReadableMap;
import com.hectorchong.herina.models.AppVersionConfig;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

public class VersionUtils {
  public static String getVersionJsonPath(Context context) {
    return FileUtils.getHerinaDir(context) + "/" + "version.json";
  }

  public static boolean setVersionKey(Context context, String key, int value) {
    JSONObject jsonObject = getVersionJsonAsJson(context);

    try {
      jsonObject.put(key, value);

      writeVersionJson(context, jsonObject);

      return true;
    } catch (JSONException e) {
      e.printStackTrace();

      return false;
    }
  }

  public static boolean setVersionKey(Context context, String key, Object value) {
    JSONObject jsonObject = getVersionJsonAsJson(context);

    try {
      jsonObject.put(key, value);

      writeVersionJson(context, jsonObject);

      return true;
    } catch (JSONException e) {
      e.printStackTrace();

      return false;
    }
  }

  public static void writeVersionJson(Context context, JSONObject jsonObject) {
    String path = getVersionJsonPath(context);

    try {
      FileOutputStream os = new FileOutputStream(path);
      os.write(jsonObject.toString().getBytes(StandardCharsets.UTF_8));
      os.close();
    } catch (IOException e) {
      e.printStackTrace();

    }
  }

  public static JSONObject getVersionJsonAsJson(Context context) {
    AppVersionConfig config = getVersionJson(context);

    if (config != null) {
      return config.getJsonObject();
    } else {
      return null;
    }
  }

  public static AppVersionConfig getVersionJson(Context context) {
    String path = getVersionJsonPath(context);
    File jsonFile = new File(path);

    if (jsonFile.exists()) {
      String jsonPlain = FileUtils.readFileAsJsonString(path);

      try {
        JSONObject jsonObject = new JSONObject(jsonPlain);

        return AppVersionConfig.initWithJSON(jsonObject);
      } catch (JSONException e) {
        e.printStackTrace();
        return null;
      }
    } else {
      return null;
    }
  }

  public static AppVersionConfig createVersionJson(Context context, ReadableMap params) {
    String path = getVersionJsonPath(context);
    File jsonFile = new File(path);

    jsonFile.deleteOnExit();

    AppVersionConfig config = new AppVersionConfig();

    config.setUseOriginal(params.getBoolean("useOriginal") ? 1 : 0);
    config.setOriginalVersionNum(params.getInt("originalVersionNum"));
    config.setIsBundleAvailable(params.getInt("isBundleAvailable"));
    config.setOriginalCommitHash(params.getString("originalCommitHash"));
    config.setVersionNum(params.getInt("versionNum"));
    config.setCommitHash(params.getString("commitHash"));
    config.setNextVersionNum(params.getInt("nextVersionNum"));
    config.setNextCommitHash(params.getString("nextCommitHash"));
    config.setIsIncrementalAvailable(params.getInt("isIncrementalAvailable"));
    config.setIncrementalsToApply(new JSONArray(params.getArray("incrementalsToApply").toArrayList()));

    try (PrintWriter out = new PrintWriter(new FileWriter(path))) {
      out.write(config.getJsonObject().toString());
    } catch (IOException e) {
      e.printStackTrace();

      return null;
    }

    return config;
  }
}
