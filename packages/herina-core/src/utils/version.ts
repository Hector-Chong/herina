import { existsSync, readJSONSync, writeJSONSync } from "fs-extra";
import path from "path";
import {
  HerinaConfig,
  HerinaVersionsInfo,
  HerinaVersionsItem
} from "@herina-rn/shared";
import { md5 } from "./str";
import { manifest } from "../builder/manifest";
import { defaults } from "lodash";

export const getVersionsJsonPath = (config: HerinaConfig) =>
  path.resolve(config.outputPath, "versions.json");

export const versionsJsonExists = (config: HerinaConfig) =>
  existsSync(getVersionsJsonPath(config));

export const getVersionsJson = (
  config: HerinaConfig
): HerinaVersionsInfo | undefined =>
  versionsJsonExists(config)
    ? readJSONSync(getVersionsJsonPath(config))
    : undefined;

export const createVersiosnJsonIfNotExist = (
  config: HerinaConfig
): HerinaVersionsInfo => {
  const basicData: HerinaVersionsInfo = {
    releaseVersionNums: [],
    versions: []
  };

  if (!versionsJsonExists(config)) {
    writeJSONSync(getVersionsJsonPath(config), basicData);
    return basicData;
  } else {
    return getVersionsJson(config);
  }
};

export const createIncrementalFileNameViaCommitHashes = (
  newCommitHash: string,
  oldCommitHash: string
) => md5(`${newCommitHash}-${oldCommitHash}`) + ".js";

export const addVersionHistory = (
  config: HerinaConfig,
  info: HerinaVersionsInfo,
  newCommitHash = ""
) => {
  const lastVersionItem = info.versions[0];

  const version: HerinaVersionsItem = {
    commitHash: newCommitHash,
    versionNum: lastVersionItem ? lastVersionItem.versionNum + 1 : 1,
    lastCommitHash: lastVersionItem ? lastVersionItem.commitHash : "",
    filePath: {
      full: "",
      incremental: "",
      vendor: ""
    },
    assets: {},
    metaInfo: config.metaInfo ? JSON.stringify(config.metaInfo) : undefined
  };

  info.versions.unshift(version);

  return info;
};

export const addAssetsToVersionsJson = (info: HerinaVersionsInfo) => {
  const manifestAssets = manifest.chunksReversed.assets || {};
  const latestVersions = info.versions[0];

  const previousAssets: Record<number, string> = info.versions
    .slice(1)
    .reduce((prev, cur) => {
      const assets = cur.assets;

      return defaults(prev, assets);
    }, {});

  const previousAssetsKeys = new Set(Object.keys(previousAssets).map(Number));
  const newAssets = (latestVersions.assets = {});

  Object.keys(manifestAssets).map((id) => {
    if (!previousAssetsKeys.has(+id)) {
      newAssets[id] = manifestAssets[id];
    }
  });
};
