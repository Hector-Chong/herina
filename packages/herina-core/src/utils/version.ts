import { existsSync, readJSONSync, writeJSONSync } from "fs-extra";
import path, { resolve } from "path";
import {
  HerinaConfigInternal,
  HerinaManifest,
  HerinaVersionsInfo,
  HerinaVersionsItem
} from "@herina-rn/shared";
import { md5 } from "@herina-rn/shared";
import { computeDifferentFiles } from "./git";

export const getVersionsJsonPath = (config: HerinaConfigInternal) =>
  path.resolve(config.outputPath, "versions.json");

export const versionsJsonExists = (config: HerinaConfigInternal) =>
  existsSync(getVersionsJsonPath(config));

export const getVersionsJson = (
  config: HerinaConfigInternal
): HerinaVersionsInfo | undefined =>
  versionsJsonExists(config)
    ? readJSONSync(getVersionsJsonPath(config))
    : undefined;

export const createVersiosnJsonIfNotExist = (
  config: HerinaConfigInternal
): HerinaVersionsInfo => {
  const basicData: HerinaVersionsInfo = {
    releaseVersionNums: [],
    versions: []
  };

  if (!versionsJsonExists(config)) {
    writeJSONSync(getVersionsJsonPath(config), basicData);
    return basicData;
  } else {
    const info = getVersionsJson(config);

    if (info && !info.isSuccessFul) {
      info.versions.shift();
    }

    info.isSuccessFul = false;

    return info;
  }
};

export const createIncrementalFileNameViaCommitHashes = (
  newCommitHash: string,
  oldCommitHash: string
) => md5(`${newCommitHash}-${oldCommitHash}`) + ".js";

export const addVersionHistory = (
  config: HerinaConfigInternal,
  info: HerinaVersionsInfo,
  newCommitHash = ""
) => {
  const lastVersionItem = info.versions[0];

  const version: HerinaVersionsItem = {
    commitHash: newCommitHash,
    versionNum: lastVersionItem ? lastVersionItem.versionNum + 1 : 1,
    lastCommitHash: lastVersionItem ? lastVersionItem.commitHash : "",
    fileNames: {
      main: "",
      incremental: "",
      vendor: ""
    },
    assets: {},
    metaInfo: config.metaInfo ? JSON.stringify(config.metaInfo) : undefined
  };

  info.versions.unshift(version);

  return info;
};

export const addAssetsToVersionsJson = async (
  config: HerinaConfigInternal,
  info: HerinaVersionsInfo,
  manifest: HerinaManifest,
  currentCommitHash: string,
  previousCommitHash: string
) => {
  const manifestAssets = manifest.chunks.assets || {};
  const latestVersions = info.versions[0];

  const differentFiles = await computeDifferentFiles(
    config.root,
    previousCommitHash,
    currentCommitHash
  );

  const newAssets = (latestVersions.assets = {});

  differentFiles.forEach((file) => {
    const { filename } = file;
    const fullPath = resolve(config.root, filename);
    const id = manifestAssets[fullPath];

    if (id) {
      newAssets[id] = fullPath;
    }
  });
};
