package com.hectorchong.herina.utils;

import android.content.Context;
import android.util.Log;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class FileUtils {
  public static String getHerinaDir(Context context) {
    String dir = context.getExternalFilesDir("Herina").getPath();

    createDirIfNotExists(dir);

    return dir;
  }

  public static String getBundleStoreDirPath(Context context) {
    String dir = getHerinaDir(context) + "/" + "/bundle";

    createDirIfNotExists(dir);

    return dir;
  }

  public static String getIncrementalStorePath(Context context) {
    String dir = getHerinaDir(context) + "/" + "/incremental";

    createDirIfNotExists(dir);

    return dir;
  }

  public static void createDirIfNotExists(String path) {
    File dirFile = new File(path);

    if (!dirFile.exists() || !dirFile.isDirectory()) {
      dirFile.mkdir();
    }
  }

  public static String readFileAsJsonString(String path) {
    File jsonFile = new File(path);

    try {
      InputStream is = new FileInputStream(jsonFile);
      BufferedReader reader = new BufferedReader(new InputStreamReader(is));
      StringBuilder stringBuilder = new StringBuilder();
      String line = null;

      while ((line = reader.readLine()) != null) {
        stringBuilder.append(line);
      }

      reader.close();
      return stringBuilder.toString();
    } catch (IOException e) {
      e.printStackTrace();

      return null;
    }
  }
}
