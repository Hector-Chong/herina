import defineHerinaConfig from "./src/helpers/defineHerinaConfig";
import { resolve } from "path";

export default defineHerinaConfig({
  environment: "production",
  baseUrl: "http://192.168.1.73:8082",
  root: resolve(__dirname, "src/test/src"),
  entryFile: resolve(__dirname, "src/test/index.js"),
  outputPath: resolve(__dirname, "src/.herina"),
  minify: false,
  platform: "ios",
  manifestPath: resolve(__dirname, "src/.manifest/manifest.json")
});
