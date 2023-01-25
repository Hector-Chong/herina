import { resolve } from "path";
import { cpus } from "os";
import { HerinaConfig } from "@herina/shared";

const defaultConfig: Partial<HerinaConfig> = {
  extensions: ["js", "jsx", "ts", "tsx"],
  minify: true,
  manifestPath: resolve(__dirname, "../.herina/manifest.json"),
  maxWorkers: cpus().length,
  root: process.cwd()
};

const defineHerinaConfig = (config: HerinaConfig) => {
  return Object.assign(defaultConfig, config);
};

export default defineHerinaConfig;
