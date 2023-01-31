import { resolve } from "path";
import { cpus } from "os";
import { HerinaConfig } from "@herina-rn/shared";

const defaultConfig: Partial<HerinaConfig> = {
  extensions: ["js", "jsx", "ts", "tsx", "json"],
  minify: true,
  manifestPath: resolve(__dirname, "../.herina/manifest.json"),
  maxWorkers: cpus().length,
  root: process.cwd()
};

const defineHerinaConfig = (config: HerinaConfig) => {
  return Object.assign(defaultConfig, config);
};

export default defineHerinaConfig;
