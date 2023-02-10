package com.hectorchong.herina.utils;

import android.content.Context;
import android.graphics.drawable.Icon;
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

  public static String getChunkStoreDirPath(Context context, String chunkType) {
    String path = getHerinaDir(context) + "/" + chunkType;

    createDirIfNotExists(path);

    return path;
  }

  public static String getBundleStoreDirPath(Context context) {
    return getChunkStoreDirPath(context, "bundle");
  }

  public static String getIncrementalStorePath(Context context) {
    return getChunkStoreDirPath(context, "incremental");
  }

  public static String getAssetStorePath(Context context) {
    return getChunkStoreDirPath(context, "assets");
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
      String line;

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
