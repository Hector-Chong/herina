package com.hectorchong.herina.tools;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class FileDownloader {
  private OkHttpClient httpClient;

  public FileDownloader() {
    httpClient = new OkHttpClient();
  }

  private InputStream downloadFromRemote(String url) throws IOException {
    Request request = new Request.Builder().url(url).build();

    Response response = httpClient.newCall(request).execute();

    if (!response.isSuccessful()) {
      return null;
    }

    return response.body().byteStream();
  }

  private InputStream downloadFromLocal(String path) throws IOException {
    File file = new File(path.replaceFirst("file://", ""));

    InputStream is = new FileInputStream(file);

    return is;
  }

  public String downloadTextFile(String url) throws IOException {
    InputStream is = isLocalFile(url) ? downloadFromLocal(url) : downloadFromRemote(url);

    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
    StringBuilder stringBuilder = new StringBuilder();

    String line;
    while ((line = reader.readLine()) != null) {
      stringBuilder.append(line);
    }

    reader.close();

    return stringBuilder.toString();
  }

  public InputStream downloadBinaryFile(String url) throws IOException {
    InputStream is = isLocalFile(url) ? downloadFromLocal(url) : downloadFromRemote(url);

    return is;
  }

  public void downloadTextFileBatch(ArrayList<String> urls, FileDownloaderTextBatchCallback
    callback, boolean stopIfError) {
    Iterator<String> iterator = urls.iterator();

    while (iterator.hasNext()) {
      String url = iterator.next();

      try {
        String text = downloadTextFile(url);

        boolean next = callback.onSuccess(url, text);

        if (!next) {
          break;
        }

        if (!iterator.hasNext()) {
          callback.onFinish();
        }
      } catch (IOException e) {
        e.printStackTrace();
        callback.onError(e.getMessage());

        if (stopIfError) {
          break;
        }
      }
    }
  }

  public void downloadBinaryFileBatch
    (ArrayList<String> urls, FileDownloaderBinaryBatchCallback callback, boolean stopIfError) {
    Iterator<String> iterator = urls.iterator();

    while (iterator.hasNext()) {
      String url = iterator.next();

      try {
        boolean next = callback.onSuccess(url, downloadBinaryFile(url));

        if (!next) {
          break;
        }

        if (!iterator.hasNext()) {
          callback.onFinish();
        }
      } catch (IOException e) {
        e.printStackTrace();
        callback.onError(e.getMessage());

        if (stopIfError)
          break;
      }
    }
  }

  public static boolean isLocalFile(String url) {
    return url.startsWith("file://");
  }

  public interface FileDownloaderTextBatchCallback {
    public boolean onSuccess(String url, String data);

    public void onError(String error);

    public void onFinish();
  }

  public interface FileDownloaderBinaryBatchCallback {
    public boolean onSuccess(String url, InputStream is);

    public void onError(String error);

    public void onFinish();
  }
}
