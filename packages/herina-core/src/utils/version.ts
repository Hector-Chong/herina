import {
  existsSync,
  readJSONSync,
  readJsonSync,
  writeFileSync
} from "fs-extra";
import path from "path";
import { HerinaConfig, HerinaVersions } from "@herina-rn/shared";
import { md5 } from "./str";
import { isArrayWithLength } from "./arr";
import { manifest } from "../builder/manifest";
import { defaults } from "lodash";

export const getVersionsJsonPath = (config: HerinaConfig) =>
  path.resolve(config.outputPath, "versions.json");

export const versionsJsonExists = (config: HerinaConfig) =>
  existsSync(getVersionsJsonPath(config));

export const getVersionsJson = (
  config: HerinaConfig
): HerinaVersions | undefined =>
  versionsJsonExists(config)
    ? readJSONSync(getVersionsJsonPath(config))
    : undefined;

export const createVersiosnJsonIfNotExist = (
  config: HerinaConfig,
  currentVersionNum?: number,
  currentCommitHash?: string,
  previousCommitHash?: string
): HerinaVersions => {
  const filePath = getVersionsJsonPath(config);
  const basicData: HerinaVersions = {
    currentVersionNum: currentVersionNum || 1,
    currentCommitHash: currentCommitHash || "",
    previousCommitHash: previousCommitHash || "",
    releaseVersionNum: [],
    history: [],
    assets: {}
  };

  if (existsSync(filePath)) {
    try {
      const versions: HerinaVersions = readJsonSync(filePath);

      if (
        currentCommitHash &&
        previousCommitHash &&
        currentCommitHash !== previousCommitHash
      ) {
        versions.currentCommitHash = currentCommitHash;
        versions.previousCommitHash = previousCommitHash;
        versions.currentVersionNum += 1;
      }

      return versions;
    } catch (e) {
      return basicData;
    }
  } else {
    writeFileSync(filePath, JSON.stringify(basicData));

    return basicData;
  }
};

export const createIncrementalFileNameViaCommitHashes = (
  newCommitHash: string,
  oldCommitHash: string
) => md5(`${newCommitHash}-${oldCommitHash}`) + ".js";

export const addVersionHistory = (
  config: HerinaConfig,
  versions: HerinaVersions,
  newCommitHash = "",
  oldCommitHash = ""
) => {
  const {
    currentCommitHash: commitHash,
    currentVersionNum: versionNum,
    metaInfo
  } = versions;

  versions.metaInfo = config.metaInfo
    ? JSON.stringify(config.metaInfo)
    : undefined;

  versions.currentCommitHash = newCommitHash;
  versions.previousCommitHash = oldCommitHash;

  versions.currentVersionNum += 1;

  versions.history.unshift({
    commitHash,
    versionNum,
    filePath: "",
    assets: [],
    metaInfo
  });
};

export const addAssetsToVersionsJson = (versions: HerinaVersions) => {
  const manifestAssets = manifest.chunksReversed.assets || {};
  const currentAssets = versions.assets;

  if (isArrayWithLength(versions.history)) {
    versions.history[0].assets = currentAssets;
  }

  const previousAssets: Record<number, string> = versions.history.reduce(
    (prev, cur) => {
      const assets = cur.assets;

      return defaults(prev, assets);
    },
    {}
  );

  const previousAssetsKeys = new Set(Object.keys(previousAssets).map(Number));
  const newAssets = (versions.assets = {});

  Object.keys(manifestAssets).map((id) => {
    if (!previousAssetsKeys.has(+id)) {
      newAssets[id] = manifestAssets[id];
    }
  });
};
