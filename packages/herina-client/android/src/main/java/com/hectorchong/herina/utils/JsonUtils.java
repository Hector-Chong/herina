package com.hectorchong.herina.utils;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class JsonUtils {
  public static ArrayList jsonArrayToArrayList(JSONArray jsonArray) {
    ArrayList arrayList = new ArrayList();

    try {
      for (int i = 0; i < jsonArray.length(); i++) {
        arrayList.add(jsonArray.get(i));
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }

    return arrayList;
  }

  public static Map<String, Object> jsonObjectToMap(JSONObject jsonObject) {
    Map<String, Object> map = new HashMap<>();
    Iterator<String> jsonKeys = jsonObject.keys();

    try {
      while (jsonKeys.hasNext()) {
        String key = jsonKeys.next();
        Object value = jsonObject.get(key);

        if (value instanceof JSONArray) {
          value = jsonArrayToArrayList((JSONArray) value);
        }

        if (value instanceof JSONObject) {
          value = jsonObjectToMap((JSONObject) value);
        }

        map.put(key, value);
      }
    } catch (JSONException e) {
      e.printStackTrace();
    }

    return map;
  }

  public static JSONObject readableMapToJsonObject(ReadableMap map) {
    ReadableMapKeySetIterator keys = map.keySetIterator();
    JSONObject jsonObject = new JSONObject();

    while (keys.hasNextKey()) {
      String key = keys.nextKey();

      try {
        ReadableType type = map.getType(key);
        Object value = null;

        switch (type) {
          case Boolean:
            value = map.getBoolean(key);
            break;
          case Number:
            value = map.getDouble(key);
            break;
          case String:
            value = map.getString(key);
            break;
          case Map:
            value = JsonUtils.readableMapToJsonObject(map.getMap(key));
            break;
          case Array:
            value = JsonUtils.readableArrayToJsonArray(map.getArray(key));
            break;
        }

        jsonObject.put(key, value);
      } catch (JSONException e) {
        e.printStackTrace();

        return null;
      }
    }

    return jsonObject;
  }

  public static JSONArray readableArrayToJsonArray(ReadableArray readableArray) {
    JSONArray jsonArray = new JSONArray();
    ArrayList arrayList = readableArray.toArrayList();

    for (int i = 0; i < readableArray.size(); i++) {
      Object value = arrayList.get(i);

      if (value instanceof ReadableMap) {
        value = readableMapToJsonObject((ReadableMap) value);
      }

      jsonArray.put(value);
    }

    return jsonArray;
  }
}
