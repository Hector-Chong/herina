import { writeFileSync } from "fs";
import { emptyDirSync } from "fs-extra";
import defineHerinaConfig from "../helpers/defineHerinaConfig";
import { getConfigFilePath } from "../utils/file";
import fs from "fs-extra";
import { HerinaConfig } from "@herina/shared";

const cleanCache = (config: HerinaConfig) => {
  return emptyDirSync(config.outputPath);
};

const writeConfig = (config: HerinaConfig) => {
  const filePath = getConfigFilePath();

  fs.ensureFileSync(filePath);

  writeFileSync(filePath, `${JSON.stringify(config)}`);
};

export const prepareToBuild = (config: HerinaConfig) => {
  config.clean && cleanCache(config);

  config = defineHerinaConfig(config);

  writeConfig(config);

  return config;
};
