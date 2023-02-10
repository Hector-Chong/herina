import { join, resolve } from "path";
import { cpus } from "os";
import {
  HerinaConfig,
  HerinaConfigInternal,
  HerinaUpdateType
} from "@herina-rn/shared";
import { defaultsDeep } from "lodash";

const specifiedPlatformConfigKeys: (keyof HerinaConfig)[] = [
  "baseUrl",
  "manifestPath",
  "outputPath"
];

const overwritePlatformConfig = (config: HerinaConfig) => {
  specifiedPlatformConfigKeys.forEach((key) => {
    if (typeof config[key] === "string") {
      return config[key];
    } else {
      return config[key][config.platform];
    }
  });

  return config;
};

const defineHerinaConfig = (config: HerinaConfig) => {
  const projectRoot = resolve(config.root) || process.cwd();

  const defaultConfig: Partial<HerinaConfig> = {
    extensions: ["js", "jsx", "ts", "tsx", "json"],
    minify: true,
    manifestPath: resolve(__dirname, "../.herina/manifest.json"),
    maxWorkers: cpus().length,
    root: projectRoot,
    checkNativeChange: true,
    androidSourcePath: join(projectRoot, "android"),
    iosSourcePath: join(projectRoot, "ios"),
    updateType: HerinaUpdateType.ALL
  };

  const merged = defaultsDeep(config, defaultConfig);

  return overwritePlatformConfig(merged) as HerinaConfigInternal;
};

export default defineHerinaConfig;
