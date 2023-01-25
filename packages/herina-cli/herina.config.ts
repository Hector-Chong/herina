const { resolve } = require("path");

module.exports = {
  baseUrl: "http://192.168.1.73:8082",
  root: "/Users/hectorchong/Project/ReactNativeNewArch70",
  entryFile: "/Users/hectorchong/Project/ReactNativeNewArch70/index.js",
  outputPath: "/Users/hectorchong/Project/ReactNativeNewArch70/dist",
  minify: false,
  platform: "ios",
  manifestPath: resolve(__dirname, "src/.manifest/manifest.json")
};
