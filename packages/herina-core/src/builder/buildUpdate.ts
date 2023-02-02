import {
  HerinaConfig,
  HerinaUpdateType,
  HerinaVersionsInfo
} from "@herina-rn/shared";
import { ensureFileSync, writeFileSync, writeJsonSync } from "fs-extra";
import { HerinaUpdateBuiilder } from ".";
import { isArrayWithLength } from "../utils/arr";
import { getPrevAndCurCommitHashes, isGitRepository } from "../utils/git";
import {
  addAssetsToVersionsJson,
  addVersionHistory,
  createVersiosnJsonIfNotExist,
  getVersionsJsonPath
} from "../utils/version";
import buildBundle from "./buildBundle";
import buildFull from "./buildFull";
import buildIncremental from "./buildIncremental";
import { ChunkAsset } from "./chunkAssetAnalysers";
import { checkNativeChange, prepareToBuild } from "./prerequisite";

export const validateConfig = async (
  config: HerinaConfig,
  info: HerinaVersionsInfo
) => {
  if (!isGitRepository(config.root))
    throw new Error(`${config.root} is not a Git repository.`);

  const { previousCommitHash, currentCommitHash } =
    await getPrevAndCurCommitHashes(config);

  if (!previousCommitHash) {
    throw new Error(`Cannot find previoud commit<${previousCommitHash}>`);
  }
  if (!currentCommitHash) {
    throw new Error(`Cannot find current commit<${currentCommitHash}>`);
  }

  if (
    isArrayWithLength(info.versions) &&
    info.versions[0].commitHash === currentCommitHash
  ) {
    throw new Error(
      `It seems that no files were changed. Make sure you've committed a change to the Git repository. `
    );
  }

  return { previousCommitHash, currentCommitHash };
};

const buildRules: Record<HerinaUpdateType, HerinaUpdateBuiilder[]> = {
  [HerinaUpdateType.ALL]: [buildFull, buildIncremental],
  [HerinaUpdateType.FULL]: [buildFull],
  [HerinaUpdateType.INCREMENTAL]: [buildIncremental]
};

const writeAssets = (assets: Record<string, ChunkAsset[]>) => {
  for (const [_, modules] of Object.entries(assets)) {
    for (const module of modules) {
      ensureFileSync(module.path);

      writeFileSync(module.path, module.code);
    }
  }
};

const updateVersionsJson = async (
  config: HerinaConfig,
  info: HerinaVersionsInfo,
  buildAssets: Record<string, ChunkAsset[]>
) => {
  const chunks = ["incremental", "full", "vendor"];

  chunks.forEach((chunk) => {
    info.versions[0].filePath[chunk] = buildAssets[chunk][0].path.replace(
      config.outputPath,
      ""
    );
  });
};

const buildUpdate = async (config: HerinaConfig) => {
  config = prepareToBuild(config);

  const info = createVersiosnJsonIfNotExist(config);

  const { currentCommitHash, previousCommitHash } = await validateConfig(
    config,
    info
  );

  addVersionHistory(config, info, currentCommitHash);

  writeJsonSync(getVersionsJsonPath(config), info);

  const bundlePath = await buildBundle(config);

  const { updateType } = config;

  const builders = buildRules[updateType];

  const buildResults = await Promise.all(
    builders.map((build) =>
      build(config, info, bundlePath, currentCommitHash, previousCommitHash)
    )
  );

  addAssetsToVersionsJson(info);

  const buildAssets: Record<string, ChunkAsset[]> = buildResults.reduce(
    (prev, item) => {
      return { ...prev, ...item };
    },
    {}
  );

  checkNativeChange(config);

  updateVersionsJson(config, info, buildAssets);

  writeJsonSync(getVersionsJsonPath(config), info);

  writeAssets(buildAssets);

  return buildAssets;
};

export default buildUpdate;
