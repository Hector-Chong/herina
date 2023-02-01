import {
  emptyDirSync,
  ensureFileSync,
  writeJsonSync,
  existsSync
} from "fs-extra";
import defineHerinaConfig from "../helpers/defineHerinaConfig";
import { getConfigFilePath } from "../utils/file";
import { HerinaConfig } from "@herina-rn/shared";
import { getVersionsJson, getVersionsJsonPath } from "../utils/version";
import { computeDifferentFiles, getCurrentCommitHash } from "../utils/git";
import { warn } from "../utils/console";

const cleanCache = (config: HerinaConfig) => emptyDirSync(config.outputPath);

const writeConfig = (config: HerinaConfig) => {
  const filePath = getConfigFilePath();

  ensureFileSync(filePath);

  writeJsonSync(filePath, config);
};

export const prepareToBuild = (config: HerinaConfig) => {
  config.clean && cleanCache(config);

  config = defineHerinaConfig(config);

  writeConfig(config);

  return config;
};

export const checkNativeChange = async (config: HerinaConfig) => {
  const versionsJsonPath = getVersionsJsonPath(config);

  if (
    !config.isRelease &&
    config.checkNativeChange &&
    existsSync(versionsJsonPath)
  ) {
    const versions = getVersionsJson(config);

    const currentCommitHash = await getCurrentCommitHash(config);

    if (versions.currentCommitHash === currentCommitHash) return;

    const differentFiles = await computeDifferentFiles(
      config.root,
      versions.currentCommitHash,
      currentCommitHash
    );

    differentFiles.forEach((file) => {
      if (
        (config.platform === "android" &&
          file.filename.match(config.androidSourcePath)) ||
        (config.platform === "ios" && file.filename.match(config.iosSourcePath))
      ) {
        warn(
          `It seems that you've changed the native code or file (${file.filename}). You might consider redistributing your App on App Store.`
        );
      }
    });
  }
};
