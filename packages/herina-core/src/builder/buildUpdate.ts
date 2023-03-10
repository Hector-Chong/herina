import { parse } from "@babel/parser";
import {
  HerinaConfig,
  HerinaConfigInternal,
  HerinaUpdateType,
  HerinaVersionsInfo,
  isArrayWithLength
} from "@herina-rn/shared";
import {
  ensureFileSync,
  readFileSync,
  removeSync,
  writeFileSync,
  writeJsonSync
} from "fs-extra";
import { defaultsDeep } from "lodash";
import { HerinaUpdateBuiilder } from ".";
import HerinaEventManager from "../events";
import { getPrevAndCurCommitHashes, isGitRepository } from "../utils/git";
import { overloadManifest } from "../utils/manifest";
import {
  addAssetsToVersionsJson,
  addVersionHistory,
  createVersiosnJsonIfNotExist,
  getVersionsJsonPath
} from "../utils/version";
import buildBundle from "./buildBundle";
import buildFull from "./buildFull";
import buildIncremental from "./buildIncremental";
import { ChunkAsset } from "./chunkAnalysers";
import {
  combineManifestFromMetroWorkers,
  manifest,
  removeDuplicatedDependencies,
  removeSplittingChunkFromMain,
  updateManifest
} from "./manifest";
import { checkNativeChange, prepareToBuild } from "./prerequisite";
import splitAssets from "./splitAssets";

export const validateConfig = async (
  config: HerinaConfig,
  info: HerinaVersionsInfo
) => {
  if (!isGitRepository(config.root))
    throw new Error(`${config.root} is not a Git repository.`);

  const { previousCommitHash, currentCommitHash } =
    await getPrevAndCurCommitHashes(config);

  if (!previousCommitHash) {
    throw new Error(`Cannot find previous commit<${previousCommitHash}>`);
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

  const latestVersion = info.versions[0];

  return {
    previousCommitHash: latestVersion
      ? latestVersion.commitHash
      : previousCommitHash,
    currentCommitHash
  };
};

export const filterFile = (config: HerinaConfig, filePath: string) =>
  config.extensions!.some((ext) => filePath.endsWith("." + ext)) ||
  (manifest.chunks.assets &&
    Object.keys(manifest.chunks.assets).some((path) => path.match(filePath)));

const buildRules: Record<HerinaUpdateType, HerinaUpdateBuiilder[]> = {
  [HerinaUpdateType.ALL]: [buildIncremental, buildFull],
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
  config: HerinaConfigInternal,
  info: HerinaVersionsInfo,
  buildAssets: Record<string, ChunkAsset[]>
) => {
  Object.keys(buildAssets).forEach((chunk) => {
    if (chunk !== "dynamic") {
      info.versions[0].fileNames[chunk] = buildAssets[chunk][0].filename;
    }
  });

  info.isSuccessFul = true;

  writeJsonSync(getVersionsJsonPath(config), info);
};

const buildUpdate = async (config: HerinaConfig) => {
  const internalConfig = prepareToBuild(config);

  const info = createVersiosnJsonIfNotExist(internalConfig);

  const { currentCommitHash, previousCommitHash } = await validateConfig(
    internalConfig,
    info
  );

  overloadManifest(internalConfig, manifest);

  addVersionHistory(internalConfig, info, currentCommitHash);

  writeJsonSync(getVersionsJsonPath(internalConfig), info);

  const bundlePath = await buildBundle(internalConfig);

  const bundleStream = readFileSync(bundlePath);

  const bundleAst = parse(bundleStream.toString());

  const manifistFromDisk = combineManifestFromMetroWorkers(internalConfig);

  defaultsDeep(manifest.chunks, manifistFromDisk.chunks);

  removeSplittingChunkFromMain(manifest);

  removeDuplicatedDependencies(manifest);

  await addAssetsToVersionsJson(
    internalConfig,
    info,
    manifest,
    currentCommitHash,
    previousCommitHash
  );

  HerinaEventManager.emit("afterBundleBuild", bundleAst);

  await splitAssets(internalConfig, info);

  const { updateType } = internalConfig;
  const builders = buildRules[updateType];

  const buildResults = [];

  for (const build of builders) {
    buildResults.push(
      await build(
        internalConfig,
        info,
        bundlePath,
        currentCommitHash,
        previousCommitHash,
        bundleAst
      )
    );
  }

  const buildAssets: Record<string, ChunkAsset[]> = buildResults.reduce(
    (prev, item) => {
      return { ...prev, ...item };
    },
    {}
  );

  if (config.checkNativeChange) {
    await checkNativeChange(internalConfig);
  }

  updateVersionsJson(internalConfig, info, buildAssets);

  updateManifest(internalConfig);

  writeAssets(buildAssets);

  removeSync(bundlePath);

  return buildAssets;
};

export default buildUpdate;
