import {
  emptyDirSync,
  ensureDirSync,
  ensureFileSync,
  writeJsonSync
} from "fs-extra";
import defineHerinaConfig from "../helpers/defineHerinaConfig";
import { getConfigFilePath } from "../utils/file";
import { HerinaConfig } from "@herina-rn/shared";
import { getVersionsJson } from "../utils/version";
import { computeDifferentFiles } from "../utils/git";
import { warn } from "../utils/console";
import { getArrayLastOne, isArrayWithLength } from "../utils/arr";

const cleanCache = (config: HerinaConfig) => emptyDirSync(config.outputPath);

const writeConfig = (config: HerinaConfig) => {
  const filePath = getConfigFilePath();

  ensureFileSync(filePath);

  writeJsonSync(filePath, config);
};

export const prepareToBuild = (config: HerinaConfig) => {
  config.clean && cleanCache(config);

  config = defineHerinaConfig(config);

  ensureDirSync(config.outputPath);

  writeConfig(config);

  return config;
};

export const checkNativeChange = async (config: HerinaConfig) => {
  const info = getVersionsJson(config);

  if (!config.checkNativeChange || !info || !isArrayWithLength(info.versions))
    return;

  const currentReleaseVerNum =
    config.currentReleaseVersionNum || getArrayLastOne(info.releaseVersionNums);

  const versionItem = info.versions.find(
    (item) => item.versionNum === currentReleaseVerNum
  );

  const latestVersionItem = getArrayLastOne(info.versions);

  if (!versionItem) return;

  const oldCommitHash = versionItem.commitHash;
  const { commitHash: currentCommitHash } = latestVersionItem;

  if (oldCommitHash === currentCommitHash) return;

  const differentFiles = await computeDifferentFiles(
    config.root,
    oldCommitHash,
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
};
