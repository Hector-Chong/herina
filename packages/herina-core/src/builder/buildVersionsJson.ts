import { HerinaConfig } from "@herina-rn/shared";
import { ensureFileSync, writeFileSync } from "fs-extra";
import { isGitRepository } from "../utils/git";
import {
  createVersiosnJsonIfNotExist,
  getVersionsJsonPath
} from "../utils/version";
import { getPrevAndCurCommitHashes } from "./buildIncremental";

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

  const path = getVersionsJsonPath(config);

  ensureFileSync(path);

  writeFileSync(path, JSON.stringify(versions));

  return path;
};

export default buildVersionsJson;
