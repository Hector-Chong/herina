import { existsSync, readJsonSync, writeFileSync } from "fs-extra";
import path from "path";
import { HerinaConfig, HerinaVersions } from "@herina-rn/shared";
import { md5 } from "./str";

export const getVersionsJsonPath = (config: HerinaConfig) => {
  return path.resolve(config.outputPath, "versions.json");
};

export const createVersiosnJsonIfNotExist = (
  config: HerinaConfig,
  currentVersionNum?: number,
  currentCommitHash?: string,
  previousCommitHash?: string
): HerinaVersions => {
  const filePath = getVersionsJsonPath(config);
  const basicData = {
    currentVersionNum: currentVersionNum || 1,
    currentCommitHash: currentCommitHash || "",
    previousCommitHash: previousCommitHash || "",
    history: []
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

const createIncrementalFileNameViaCommitHashes = (
  newCommitHash: string,
  oldCommitHash: string
) => md5(`${newCommitHash}-${oldCommitHash}`) + ".js";

export const addVersionHistory = (
  newCommitHash: string,
  oldCommitHash: string,
  versions: HerinaVersions
) => {
  const { currentCommitHash: commitHash, currentVersionNum: versionNum } =
    versions;

  versions.currentCommitHash = newCommitHash;
  versions.previousCommitHash = oldCommitHash;

  if (newCommitHash === oldCommitHash) {
    throw new Error(`Current and previous commits cannot be the same.`);
  }

  if (!commitHash) {
    return createIncrementalFileNameViaCommitHashes(
      newCommitHash,
      oldCommitHash
    );
  }

  if (newCommitHash === commitHash) {
    return createIncrementalFileNameViaCommitHashes(
      newCommitHash,
      oldCommitHash
    );
  } else {
    versions.currentVersionNum += 1;

    const filePath = createIncrementalFileNameViaCommitHashes(
      newCommitHash,
      commitHash
    );

    versions.history.unshift({
      commitHash,
      versionNum,
      filePath
    });

    return filePath;
  }
};
