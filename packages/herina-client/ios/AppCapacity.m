package com.hectorchong.herina;

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
import com.hectorchong.herina.utils.JsonUtils;
import com.hectorchong.herina.utils.VersionUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;

public class AppCapacityImpl {
  public static final String NAME = "Herina";

  private static AppCapacityImpl instance;
  private static ReactApplicationContext reactContext;

  private String baseUrl;

  public AppCapacityImpl(ReactApplicationContext context) {
    reactContext = context;
    instance = this;
  }

  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("assetsURL", "file://" + FileUtils.getAssetStorePath(reactContext));
    return constants;
  }

  public void initVersionJson(ReadableMap params, Callback callback) {
    AppVersionConfig config = VersionUtils.createVersionJson(reactContext, params);

    callback.invoke(config == null);
  }

  public void getVersionConfig(Callback callback) {
    AppVersionConfig versionConfig = VersionUtils.getVersionJson(reactContext);

    if (versionConfig != null) {
      callback.invoke(false, versionConfig.getWritableMap());
    } else {
      callback.invoke(false);
    }
  }

  public void setVersionConfigValues(ReadableMap params, Callback callback) {
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
              versionConfigJson.put(key, JsonUtils.readableArrayToJsonArray(params.getArray(key)));
              break;
          }

          VersionUtils.writeVersionJson(reactContext, versionConfigJson);

        } catch (JSONException e) {
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
    HerinaVersionsHistoryItem version = HerinaVersionsHistoryItem.initWithDictionary(params.getMap("version"));

    ArrayList<String> chunkTypes = new ArrayList<>();
    chunkTypes.add("vendor");
    chunkTypes.add("main");

    this.baseUrl = baseUrl;

    OkHttpClient client = new OkHttpClient();

    for (int i = 0; i < chunkTypes.size(); i++) {
      String chunkType = chunkTypes.get(i);
      String chunkStoreDir = FileUtils.getChunkStoreDirPath(reactContext, chunkType);
      String chunkName = version.getFileNames().getReadbleMap().getString(chunkType);
      String chunkStorePath = chunkStoreDir + "/" + chunkName;
      File chunkFile = new File(chunkStorePath);

      String chunkUrl = baseUrl + "/" + chunkType + "/" + chunkName;

      Request request = new Request.Builder().url(chunkUrl).build();

      try (Response response = client.newCall(request).execute()) {
        if (!response.isSuccessful()) {
          callback.invoke(true, chunkUrl + " downloading failed.");
          return;
        }

        ResponseBody body = response.body();
        String chunkData = body.string();

        if (!chunkFile.exists()) {
          chunkFile.createNewFile();
        }

        FileOutputStream handle = new FileOutputStream(chunkFile, false);

        handle.write(chunkData.getBytes(StandardCharsets.UTF_8));
        handle.close();
      } catch (IOException e) {
        e.printStackTrace();

        callback.invoke(true, chunkUrl + " downloading failed.");

        return;
      }
    }

    if (version.getAssets() != null && downloadAssets(version.getAssets(), callback)) {
      callback.invoke(false);
    }

    callback.invoke(false);
  }

  public boolean downloadAssets(HashMap<String, Object> assets, Callback callback) {
    String assetStoreDir = FileUtils.getAssetStorePath(reactContext);
    Iterator<String> assetKeys = assets.keySet().iterator();

    OkHttpClient client = new OkHttpClient();

    while (assetKeys.hasNext()) {
      String assetId = assetKeys.next();
      String assetName = (String) assets.get(assetId);
      String assetStorePath = assetStoreDir + "/" + assetName;
      File assetFile = new File(assetStorePath);

      String fullUrl = baseUrl + "/" + "assets" + "/" + assetName;

      Request request = new Request.Builder().url(fullUrl).build();

      try (Response response = client.newCall(request).execute()) {
        if (!response.isSuccessful()) {
          callback.invoke(true, fullUrl + " downloading failed.");
          return false;
        }

        ResponseBody body = response.body();
        String chunkData = body.string();

        if (!assetFile.exists()) {
          assetFile.createNewFile();
        }

        FileOutputStream handle = new FileOutputStream(assetFile, false);

        handle.write(chunkData.getBytes());
        handle.close();
      } catch (IOException e) {
        e.printStackTrace();

        callback.invoke(true, fullUrl + " downloading failed.");

        return false;
      }
    }

    return true;
  }

  public void downloadIncrementalUpdates(ReadableMap params, Callback callback) {
    String baseUrl = params.getString("baseUrl");
    this.baseUrl = baseUrl;

    ReadableArray versionDicts = params.getArray("versions");
    OkHttpClient client = new OkHttpClient();

    for (int i = 0; i < versionDicts.size(); i++) {
      HerinaVersionsHistoryItem item = HerinaVersionsHistoryItem.initWithDictionary(versionDicts.getMap(i));

      String fileName = item.getFileNames().getIncremental();
      String incrementalUrl = baseUrl + "/" + "incremental" + "/" + fileName;
      String incrementalStorePath = FileUtils.getIncrementalStorePath(reactContext) + "/" + fileName;

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

        if (item.getAssets() != null && !downloadAssets(item.getAssets(), callback)) {
          break;
        }
      } catch (IOException e) {
        e.printStackTrace();

        callback.invoke(true, incrementalUrl + " downloading failed.");

        return;
      }
    }

    callback.invoke(false);
  }

  public void applyFullUpdate(Callback callback) {
    AppVersionConfig config = VersionUtils.getVersionJson(reactContext);

    if (config == null || config.getFullToApply() == null) {
      callback.invoke(true, "No downloaded bundle found. Please make sure you've invoked `requestFullUpdate`.");

      return;
    }

    String baseStorePath = FileUtils.getBundleStoreDirPath(reactContext);
    String bundleStorePath = baseStorePath + "/" + config.getNextVersionNum() + ".js";
    File bundleFile = new File(bundleStorePath);
    PrintWriter bundleWriter = null;

    ArrayList<String> chunkTypes = new ArrayList<>();
    chunkTypes.add("vendor");
    chunkTypes.add("main");

    bundleFile.deleteOnExit();

    try {
      bundleFile.createNewFile();
      bundleWriter = new PrintWriter(bundleFile);
    } catch (IOException e) {
      callback.invoke(true, "Failed to create the new bundle file.");
    }

    for (int i = 0; i < chunkTypes.size(); i++) {
      String chunkType = chunkTypes.get(i);

      String chunkName = config.getFullToApply().getFileNames().getReadbleMap().getString(chunkType);
      String chunkStorePath = FileUtils.getChunkStoreDirPath(reactContext, chunkType) + "/" + chunkName;
      File chunkFile = new File(chunkStorePath);

      try {
        BufferedReader br = new BufferedReader(new FileReader(chunkFile));

        String line = br.readLine();

        while (line != null) {
          bundleWriter.println(line);
          line = br.readLine();
        }

        br.close();
      } catch (FileNotFoundException e) {
        e.printStackTrace();

        callback.invoke(true, "Failed to find " + chunkStorePath + ".");
        return;
      } catch (IOException e) {
        e.printStackTrace();

        callback.invoke(true, "Failed to read " + chunkStorePath + ".");
        return;
      }
    }

    bundleWriter.flush();
    bundleWriter.close();

    callback.invoke(false);
  }

  public void applyIncrementalUpdate(Callback callback) {
    AppVersionConfig config = VersionUtils.getVersionJson(reactContext);

    if (config == null) {
      callback.invoke(true, "version.json is not found.");
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

    String bundlePath = FileUtils.getBundleStoreDirPath(reactContext) + "/" + config.getNextVersionNum() + ".js";
    File bundleFile = new File(bundlePath);

    try {
      bundleFile.createNewFile();

      FileOutputStream os = new FileOutputStream(bundleFile);
      os.write(bundleCode.getBytes(StandardCharsets.UTF_8));
      os.close();

      callback.invoke(false);
    } catch (IOException e) {
      e.printStackTrace();

      callback.invoke(true, e.getMessage());
    }
  }

  public void setUseOriginalBundle(ReadableMap params, Callback callback) {
    int isOriginal = params.getInt("original");

    boolean res = VersionUtils.setVersionKey(reactContext, "useOriginal", isOriginal);

    callback.invoke(!res);
  }

  @MainThread
  public void reloadApp() {
    ReactActivity activity = (ReactActivity) reactContext.getCurrentActivity();
    ReactApplication application = (ReactApplication) activity.getApplication();
    ReactInstanceManager manager = application.getReactNativeHost().getReactInstanceManager();

    manager.recreateReactContextInBackground();
  }
}
