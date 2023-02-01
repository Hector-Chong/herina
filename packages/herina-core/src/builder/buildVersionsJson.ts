import { HerinaConfig } from "@herina-rn/shared";
import { ensureFileSync, writeFileSync } from "fs-extra";
import { invert } from "lodash";
import { isArrayWithLength } from "../utils/arr";
import { getPrevAndCurCommitHashes, isGitRepository } from "../utils/git";
import {
  addAssetsToVersionsJson,
  createVersiosnJsonIfNotExist,
  getVersionsJsonPath
} from "../utils/version";
import { manifest } from "./manifest";

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

  const isNewlyCreated = !isArrayWithLength(versions.history);

  if (isNewlyCreated) {
    const manifestAssets = manifest.chunksReversed.assets || {};

    versions.releaseVersionNum = [1];
    versions.assets = invert(manifestAssets);
  } else {
    config.isRelease &&
      versions.releaseVersionNum.push(versions.currentVersionNum);

    addAssetsToVersionsJson(versions);
  }

  const path = getVersionsJsonPath(config);

  ensureFileSync(path);

  writeFileSync(path, JSON.stringify(versions));

  return path;
};

export default buildVersionsJson;
