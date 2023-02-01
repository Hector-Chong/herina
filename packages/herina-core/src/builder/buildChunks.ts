import { parse } from "@babel/parser";
import generate from "@babel/generator";
import buildBundle from "./buildBundle";
import {
  ChunkAsset,
  dynamicChunkAnalyser,
  mainChunkAnalyser,
  vendorChunkAnalyser
} from "./chunkAssetAnalysers";
import minifyCode from "./minifyCode";
import {
  combineManifestFromMetroWorkers,
  manifest,
  removeDuplicatedDependencies,
  removeSplittingChunkFromMain
} from "./manifest";
import bundleTransformer from "../bundleTransformer";
import {
  emptyDirSync,
  writeJsonSync,
  readFileSync,
  writeFileSync
} from "fs-extra";
import { checkNativeChange, prepareToBuild } from "./prerequisite";
import { HerinaConfig } from "@herina-rn/shared";
import path from "path";
import removeDynamicFromBundleTransformer from "../bundleTransformer/removeDynamicFromBundleTransformer";
import { getCacheManifestDir } from "../utils/manifest";
import { defaultsDeep } from "lodash";
import { existsSync } from "fs";
import {
  addAssetsToVersionsJson,
  addVersionHistory,
  getVersionsJson,
  getVersionsJsonPath
} from "../utils/version";

const writeAssets = (assets: Record<string, ChunkAsset[]>) => {
  for (const [_, modules] of Object.entries(assets)) {
    for (const module of modules) {
      writeFileSync(module.path, module.code);
    }
  }
};

const rewriteBundle = (config: HerinaConfig) => {
  const bundlePath = path.resolve(config.outputPath, "bundle.js");
  const bundleStream = readFileSync(bundlePath);

  const ast = parse(bundleStream.toString());

  removeDynamicFromBundleTransformer(ast);

  const { code } = generate(ast);

  writeFileSync(bundlePath, code);
};

const buildChunks = async (config: HerinaConfig) => {
  config = prepareToBuild(config);

  const bundlePath = await buildBundle(config);
  const bundleStream = readFileSync(bundlePath);

  const manifistFromDisk = combineManifestFromMetroWorkers(config);

  defaultsDeep(manifest.chunks, manifistFromDisk.chunks);

  removeSplittingChunkFromMain(manifest);

  removeDuplicatedDependencies(manifest);

  const { ast, dynamicModulesGraph, mainChunkCode } = bundleTransformer(
    config,
    parse(bundleStream.toString())
  );

  const { code: vendorCode } = generate(ast);

  const assets: Record<string, ChunkAsset[]> = {
    dynamic: dynamicChunkAnalyser(config, manifest, dynamicModulesGraph),
    main: mainChunkAnalyser(config, mainChunkCode),
    vendor: vendorChunkAnalyser(config, vendorCode)
  };

  if (config.minify) {
    await minifyCode(assets);
  }

  const versions = getVersionsJson(config);

  if (versions) {
    addVersionHistory(versions);
    addAssetsToVersionsJson(versions);

    writeJsonSync(getVersionsJsonPath(config), versions);
  }

  checkNativeChange(config);

  writeAssets(assets);

  writeJsonSync(config.manifestPath, manifest);

  rewriteBundle(config);

  emptyDirSync(getCacheManifestDir());

  return assets;
};

export default buildChunks;
