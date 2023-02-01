import { HerinaConfig } from "@herina-rn/shared";
import { ensureFileSync, writeFileSync } from "fs-extra";
import { isArrayWithLength } from "../utils/arr";
import { getPrevAndCurCommitHashes, isGitRepository } from "../utils/git";
import {
  createVersiosnJsonIfNotExist,
  getVersionsJsonPath
} from "../utils/version";

const buildVersionsJson = async (config: HerinaConfig) => {
  if (!isGitRepository(config.root)) {
    throw new Error(`${config.root} is not a Git repository.`);
  }

  const { currentCommitHash, previousCommitHash } =
    await getPrevAndCurCommitHashes(config);

  const versions = createVersiosnJsonIfNotExist(
    config,
    1,
    currentCommitHash,
    previousCommitHash
  );

  if (!isArrayWithLength(versions.history)) {
    versions.releaseVersionNum = [1];
  } else {
    config.isRelease &&
      versions.releaseVersionNum.push(versions.currentVersionNum);
  }

  const path = getVersionsJsonPath(config);

  ensureFileSync(path);

  writeFileSync(path, JSON.stringify(versions));

  return path;
};

export default buildVersionsJson;
