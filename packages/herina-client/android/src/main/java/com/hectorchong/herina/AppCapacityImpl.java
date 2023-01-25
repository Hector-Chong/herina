package com.hectorchong.herina;

import android.util.Log;

import androidx.annotation.MainThread;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.hectorchong.herina.models.AppVersionConfig;
import com.hectorchong.herina.models.HerinaVersionsHistoryItem;
import com.hectorchong.herina.utils.FileUtils;
import com.hectorchong.herina.utils.VersionUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class AppCapacityImpl {
  public static final String NAME = "Herina";

  private static AppCapacityImpl instance;
  private static ReactApplicationContext reactContext;

  public AppCapacityImpl(ReactApplicationContext context) {
    reactContext = context;
    instance = this;
  }

  public void initVersionJson(ReadableMap params, Callback callback) {
    AppVersionConfig config = VersionUtils.createVersionJson(reactContext, params);

    callback.invoke(config == null);
  }

  public void getCurrentVersion(Callback callback) {
    AppVersionConfig versionConfig = VersionUtils.getVersionJson(reactContext);

    if (versionConfig != null) {
      callback.invoke(false, versionConfig.getWritableMap());
    } else {
      callback.invoke(false);
    }
  }

  public void recordNewestVersion(ReadableMap params, Callback callback) {
    AppVersionConfig versionConfig = VersionUtils.getVersionJson(reactContext);

    if (versionConfig != null) {
      JSONObject versionConfigJson = versionConfig.getJsonObject();

      ReadableMapKeySetIterator iterator = params.keySetIterator();

      while (iterator.hasNextKey()) {
        String key = iterator.nextKey();
        ReadableType type = params.getType(key);

        try {
          switch (type) {
            case Null:
              versionConfigJson.put(key, null);
              break;
            case Boolean:
              versionConfigJson.put(key, params.getBoolean(key));
              break;
            case Number:
              versionConfigJson.put(key, params.getDouble(key));
              break;
            case String:
              versionConfigJson.put(key, params.getString(key));
              break;
            case Array:
              versionConfigJson.put(key, params.getArray(key));
              break;
          }

          String jsonPlain = versionConfigJson.toString();

          FileOutputStream os = new FileOutputStream(VersionUtils.getVersionJsonPath(reactContext));

          os.write(jsonPlain.getBytes(StandardCharsets.UTF_8));
          os.close();
        } catch (JSONException | FileNotFoundException e) {
          e.printStackTrace();
          callback.invoke(true);

          return;
        } catch (IOException e) {
          e.printStackTrace();
          callback.invoke(true);

          return;
        }
      }

      callback.invoke(false);
    } else {
      callback.invoke(true);
    }
  }

  public void downloadBundleToUpdate(ReadableMap params, Callback callback) {
    String baseUrl = params.getString("baseUrl");

    ArrayList<String> chunkTypes = new ArrayList<>();
    chunkTypes.add("vendor");
    chunkTypes.add("main");

    String baseStorePath = FileUtils.getBundleStoreDirPath(reactContext);
    String nextBundleStorePath = baseStorePath + "/" + "bundle.next.js";
    File nextBundleFile = new File(nextBundleStorePath);
    FileOutputStream os;

    try {
      if (!nextBundleFile.exists()) {
        nextBundleFile.createNewFile();
      }

      os = new FileOutputStream(nextBundleFile);

    } catch (IOException e) {
      e.printStackTrace();

      callback.invoke(true, "Unable to create bundle file.");
      return;
    }

    OkHttpClient client = new OkHttpClient();

    for (int i = 0; i < chunkTypes.size(); i++) {
      String chunkType = chunkTypes.get(i);

      String chunkName = chunkType + ".chunk.js";
      String nextChunkName = chunkType + ".chunk.next.js";
      String nextChunkStorePath = baseStorePath + "/" + nextChunkName;

      String chunkUrl = baseUrl + "/" + chunkName;

      Request request = new Request.Builder().url(chunkUrl).build();

      try (Response response = client.newCall(request).execute()) {
        if (!response.isSuccessful()) {
          callback.invoke(true, chunkUrl + " downloading failed.");
          return;
        }

        ResponseBody body = response.body();
        String chunkData = body.string();

        if (!nextBundleFile.exists()) {
          nextBundleFile.createNewFile();
        }

        FileOutputStream handle = new FileOutputStream(nextChunkStorePath, false);

        handle.write(chunkData.getBytes(StandardCharsets.UTF_8));
        handle.close();

        os.write(chunkData.getBytes(StandardCharsets.UTF_8));
      } catch (IOException e) {
        e.printStackTrace();

        callback.invoke(true, chunkUrl + " downloading failed.");

        return;
      }
    }

    try {
      os.close();
    } catch (IOException e) {
      e.printStackTrace();
    }

    callback.invoke(false);
  }

  public void downloadIncrementalUpdates(ReadableMap params, Callback callback) {
    String baseUrl = params.getString("baseUrl");
    ReadableArray versionDicts = params.getArray("versions");
    OkHttpClient client = new OkHttpClient();
    ArrayList<String> incrementals = new ArrayList<>();

    for (int i = 0; i < versionDicts.size(); i++) {
      HerinaVersionsHistoryItem item = HerinaVersionsHistoryItem.initWithDictionary(versionDicts.getMap(i));

      String incrementalUrl = baseUrl + "/" + "incremental" + "/" + item.getFilePath();
      String incrementalStorePath = FileUtils.getIncrementalStorePath(reactContext) + "/" + item.getFilePath();

      File incrementalFile = new File(incrementalStorePath);
      incrementalFile.deleteOnExit();

      Request request = new Request.Builder().url(incrementalUrl).build();

      try (Response response = client.newCall(request).execute()) {
        if (!response.isSuccessful()) {
          callback.invoke(true, incrementalUrl + " downloading failed.");
          return;
        }

        ResponseBody body = response.body();
        String chunkData = body.string();

        incrementalFile.createNewFile();

        FileOutputStream handle = new FileOutputStream(incrementalStorePath, false);

        handle.write(chunkData.getBytes(StandardCharsets.UTF_8));
        handle.close();

        incrementals.add(item.getFilePath());
      } catch (IOException e) {
        e.printStackTrace();

        callback.invoke(true, incrementalUrl + " downloading failed.");

        return;
      }
    }

    Collections.reverse(incrementals);

    VersionUtils.setVersionKeyInt(reactContext, "isIncrementalAvailable", 1);
    VersionUtils.setVersionKeyArray(reactContext, "incrementalsToApply", incrementals);

    callback.invoke(false);
  }

  public void applyBundleUpdate(Callback callback) {
    String baseStorePath = FileUtils.getBundleStoreDirPath(reactContext);
    String oldBundleStorePath = baseStorePath + "/" + "bundle.old.js";
    String nextBundleStorePath = baseStorePath + "/" + "bundle.next.js";
    String bundleStorePath = baseStorePath + "/" + "bundle.js";

    File oldBundleFile = new File(oldBundleStorePath);
    File nextBundleFile = new File(nextBundleStorePath);
    File bundleFile = new File(bundleStorePath);

    if (!nextBundleFile.exists()) {
      callback.invoke(true, "No downloaded bundle found. Please make sure you`ve invoked `downloadBundleToUpdate` or `requestIncrementalUpdates`.");
      return;
    }

    ArrayList<String> chunkTypes = new ArrayList<>();
    chunkTypes.add("vendor");
    chunkTypes.add("main");

    for (int i = 0; i < chunkTypes.size(); i++) {
      String chunkType = chunkTypes.get(i);

      String chunkName = chunkType + ".chunk.js";
      String chunkStorePath = baseStorePath + "/" + chunkName;
      File chunkFile = new File(chunkStorePath);

      String oldChunkName = chunkType + ".chunk.js";
      String oldChunkStorePath = baseStorePath + "/" + oldChunkName;
      File oldChunkFile = new File(oldChunkStorePath);

      if (chunkFile.exists()) {
        chunkFile.renameTo(oldChunkFile);
      }
    }

    if (bundleFile.exists()) {
      bundleFile.renameTo(oldBundleFile);
    }

    nextBundleFile.renameTo(bundleFile);

    VersionUtils.setVersionKeyInt(reactContext, "useOriginal", 0);

    callback.invoke(false);
  }

  public void applyIncrementalUpdate(Callback callback) {
    AppVersionConfig config = VersionUtils.getVersionJson(reactContext);

    if (config == null) {
      callback.invoke(true, "No version.json found.");
      return;
    }

    if (!config.getIsIncrementalAvailable() || config.getIncrementalsToApply().length() == 0) {
      callback.invoke(true, "No incremental updates found. Make sure you've invoked `requestIncrementalUpdates`.");
      return;
    }

    String incrementalCode = "";

    for (int i = 0; i < config.getIncrementalsToApply().length(); i++) {
      try {
        String filePath = config.getIncrementalsToApply().getString(i);
        String fullFilePath = FileUtils.getIncrementalStorePath(reactContext) + "/" + filePath;

        FileInputStream is = new FileInputStream(fullFilePath);
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String line;

        while ((line = reader.readLine()) != null) {
          incrementalCode += line;
        }

        is.close();
      } catch (JSONException | IOException e) {
        e.printStackTrace();

        callback.invoke(true, e.getMessage());
        return;
      }
    }

    String insertTag = "\"#HERINAINSERTTAG#\"";
    String bundleCode = BundleManager.getBundleCode(reactContext, false);

    incrementalCode += insertTag;
    bundleCode = bundleCode.replace(insertTag, incrementalCode);

    Log.d("Herina", "incrementalCode " + incrementalCode);
    Log.d("Herina", "bundleCode " + bundleCode);

    String baseStorePath = FileUtils.getBundleStoreDirPath(reactContext);
    String oldBundleStorePath = baseStorePath + "/" + "bundle.old.js";
    String bundleStorePath = baseStorePath + "/" + "bundle.js";

    File oldBundleFile = new File(oldBundleStorePath);
    File bundleFile = new File(bundleStorePath);

    if (bundleFile.exists()) {
      oldBundleFile.deleteOnExit();
    }

    bundleFile.renameTo(oldBundleFile);

    try {
      bundleFile.createNewFile();

      FileOutputStream os = new FileOutputStream(bundleFile);
      os.write(bundleCode.getBytes(StandardCharsets.UTF_8));
      os.close();

      VersionUtils.setVersionKeyInt(reactContext, "isIncrementalAvailable", 0);
      VersionUtils.setVersionKeyArray(reactContext, "incrementalsToApply", new ArrayList());
      VersionUtils.setVersionKeyInt(reactContext, "useOriginal", 0);

      callback.invoke(false);
    } catch (IOException e) {
      e.printStackTrace();

      callback.invoke(true);
    }
  }

  public void setUseOriginalBundle(ReadableMap params, Callback callback) {
    int isOriginal = params.getInt("original");

    boolean res = VersionUtils.setVersionKeyInt(reactContext, "useOriginal", isOriginal);

    callback.invoke(res);
  }

  @MainThread
  public void reloadApp() {
    ReactActivity activity = (ReactActivity) reactContext.getCurrentActivity();
    ReactApplication application = (ReactApplication) activity.getApplication();
    ReactInstanceManager manager = application.getReactNativeHost().getReactInstanceManager();

    manager.recreateReactContextInBackground();
  }
}
