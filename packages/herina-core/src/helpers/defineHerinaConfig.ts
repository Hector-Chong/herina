import { join, resolve } from "path";
import { cpus } from "os";
import { HerinaConfig, HerinaUpdateType } from "@herina-rn/shared";
import { defaultsDeep } from "lodash";

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
    isRelease: false,
    updateType: HerinaUpdateType.ALL
  };

  return defaultsDeep(config, defaultConfig);
};

export default defineHerinaConfig;
