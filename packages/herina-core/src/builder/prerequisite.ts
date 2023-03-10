import {
  emptyDirSync,
  ensureDirSync,
  ensureFileSync,
  writeJsonSync
} from "fs-extra";
import { getConfigFilePath } from "../utils/file";
import {
  getArrayLastOne,
  isArrayWithLength,
  HerinaConfigInternal,
  HerinaConfig
} from "@herina-rn/shared";
import { getVersionsJson } from "../utils/version";
import { computeDifferentFiles } from "../utils/git";
import { warn } from "../utils/console";
import defineHerinaConfig from "../helpers/defineHerinaConfig";

const cleanCache = (config: HerinaConfigInternal) =>
  emptyDirSync(config.outputPath);

const writeConfig = (config: HerinaConfigInternal) => {
  const filePath = getConfigFilePath();

  ensureFileSync(filePath);

  writeJsonSync(filePath, config);
};

export const prepareToBuild = (config: HerinaConfig | HerinaConfigInternal) => {
  const internal = defineHerinaConfig(config);

  internal.clean && cleanCache(internal);

  ensureDirSync(internal.outputPath);

  writeConfig(internal);

  return internal;
};

export const checkNativeChange = async (config: HerinaConfigInternal) => {
  const info = getVersionsJson(config);

  if (!info || !isArrayWithLength(info.versions)) return;

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
