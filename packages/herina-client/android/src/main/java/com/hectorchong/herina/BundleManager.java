package com.hectorchong.herina;

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;
import android.util.Log;

import com.hectorchong.herina.models.AppVersionConfig;
import com.hectorchong.herina.utils.FileUtils;
import com.hectorchong.herina.utils.VersionUtils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

public class BundleManager {
  private static boolean copyOriginalBundle(Context context) {
    String bundleDir = FileUtils.getBundleStoreDirPath(context);
    String bundlePath = bundleDir + "/" + "bundle.js";
    String originalBundlePath = bundleDir + "/" + "bundle.original.js";
    File originalBundleFile = new File(originalBundlePath);

    try {
      if (originalBundleFile.exists()) {
        return true;
      }

      AssetManager manager = context.getAssets();
      InputStream is = manager.open("bundle.js");
      BufferedReader reader = new BufferedReader(new InputStreamReader(is));
      String line;
      FileOutputStream orignalOs = new FileOutputStream(originalBundlePath, false);
      FileOutputStream currentOs = new FileOutputStream(bundlePath, false);

      while ((line = reader.readLine()) != null) {
        orignalOs.write(line.getBytes(StandardCharsets.UTF_8));
        orignalOs.write(("\n").getBytes(StandardCharsets.UTF_8));

        currentOs.write(line.getBytes(StandardCharsets.UTF_8));
        currentOs.write(("\n").getBytes(StandardCharsets.UTF_8));
      }

      orignalOs.close();
      currentOs.close();

      return true;
    } catch (IOException e) {
      e.printStackTrace();

      return false;
    }
  }

  public static String getBundleURL(Context context, boolean debug) {
    if (debug) {
      return null;
    }

    Boolean hasCopied = copyOriginalBundle(context);

    String bundleDir = FileUtils.getBundleStoreDirPath(context);
    String originalBundlePath = bundleDir + "/" + "bundle.original.js";

    AppVersionConfig versionConfig = VersionUtils.getVersionJson(context);

    if (versionConfig != null && !versionConfig.getUseOriginal()) {
      String bundlePath = bundleDir + "/" + versionConfig.getVersionNum() + ".js";
      File bundleFile = new File(bundlePath);

      if (bundleFile.exists()) {
        return bundleFile.getAbsolutePath();
      }
    }

    if (hasCopied) {
      return originalBundlePath;
    } else {
      return "assets://bundle.js";
    }
  }

  public static String getBundleCode(Context context, boolean debug) {
    String bundleUrl = getBundleURL(context, debug);
    String code = "";

    try {
      BufferedReader reader = new BufferedReader(new FileReader(bundleUrl));
      StringBuilder total = new StringBuilder();

      for (String line = reader.readLine(); line != null; line = reader.readLine()) {
        total.append(line);
        total.append("\n");
      }

      reader.close();

      return total.toString();
    } catch (IOException e) {
      e.printStackTrace();

      return code;
    }
  }
}
