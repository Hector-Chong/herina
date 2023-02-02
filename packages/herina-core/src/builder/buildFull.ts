import { parse } from "@babel/parser";
import generate from "@babel/generator";
import {
  ChunkAsset,
  defaultAnalyser,
  dynamicChunkAnalyser
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
  writeFileSync,
  ensureDirSync
} from "fs-extra";
import { HerinaConfig } from "@herina-rn/shared";
import path from "path";
import removeDynamicFromBundleTransformer from "../bundleTransformer/removeDynamicFromBundleTransformer";
import { getCacheManifestDir } from "../utils/manifest";
import { defaultsDeep } from "lodash";
import { HerinaUpdateBuiilder } from ".";

const rewriteBundle = (config: HerinaConfig) => {
  const bundlePath = path.resolve(config.outputPath, "bundle.js");
  const bundleStream = readFileSync(bundlePath);

  const ast = parse(bundleStream.toString());

  removeDynamicFromBundleTransformer(ast);

  const { code } = generate(ast);

  writeFileSync(bundlePath, code);
};

const buildFull: HerinaUpdateBuiilder = async (config, _, bundlePath) => {
  const fullPath = path.resolve(config.outputPath, "full");

  ensureDirSync(fullPath);

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
    full: defaultAnalyser("full", config, mainChunkCode),
    vendor: defaultAnalyser("vendor", config, vendorCode)
  };

  if (config.minify) {
    await minifyCode(assets);
  }

  writeJsonSync(config.manifestPath, manifest);

  rewriteBundle(config);

  emptyDirSync(getCacheManifestDir());

  return assets;
};

export default buildFull;
