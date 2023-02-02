import loadConfig from "@react-native-community/cli-config/build/loadConfig";
import { loadMetroConfig } from "@react-native-community/cli-plugin-metro";
import createMetroConfig from "./createMetroConfig";
import fs from "fs-extra";
import path from "path";
import { HerinaConfig, Recordable } from "@herina-rn/shared";

const createArgs = (config: HerinaConfig) => ({
  platform: config.platform as string,
  dev: config.environment === "development",
  bundleEncoding: "utf8",
  sourcemapUseAbsolutePath: false,
  resetCache: true,
  resetGlobalCache: false,
  verbose: false,
  generateStaticViewConfigs: true,
  entryFile: config.entryFile,
  bundleOutput: path.resolve(config.outputPath, "bundle.js")
});

const createBuildConfig = async (config: HerinaConfig) => {
  const buildConfig = await loadMetroConfig(loadConfig(config.root), {
    maxWorkers: config.maxWorkers,
    resetCache: true
  });

  const userDefinedConfigPath = path.resolve(config.root, "metro.config.js");
  const userDefinedMetroExist = fs.existsSync(userDefinedConfigPath);
  const userDefinedMetroFactory = userDefinedMetroExist
    ? require(userDefinedConfigPath)
    : () => ({});

  const userDefinedMetro =
    typeof userDefinedMetroFactory === "function"
      ? userDefinedMetroFactory({}, false)
      : userDefinedMetroFactory;

  const metroConfig = createMetroConfig(config, userDefinedMetro, false);

  Object.keys(metroConfig).forEach((categoryKey) => {
    const category = (metroConfig as Recordable)[categoryKey];

    if (category) {
      if (typeof category === "string") {
        (buildConfig as Recordable)[categoryKey] = category;
      } else {
        Object.keys(category).forEach((key) => {
          const val = category[key];

          if (category.hasOwnProperty(key)) {
            (buildConfig as Recordable)[categoryKey][key] = val;
          }
        });
      }
    }
  });

  return { args: createArgs(config), buildConfig };
};

export default createBuildConfig;
