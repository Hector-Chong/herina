import generate from "@babel/generator";
import {
  ChunkAsset,
  defaultAnalyser,
  dynamicChunkAnalyser
} from "./chunkAssetAnalysers";
import minifyCode from "./minifyCode";
import { manifest } from "./manifest";
import { emptyDirSync, writeJsonSync, ensureDirSync } from "fs-extra";
import path from "path";
import { getCacheManifestDir } from "../utils/manifest";
import { HerinaUpdateBuiilder } from ".";
import fullTransformer from "../bundleTransformer/fullTransformer";

const buildFull: HerinaUpdateBuiilder = async (
  config,
  _,
  _bundlePath,
  _currentCommitHash,
  _previousCommitHash,
  originalAst
) => {
  const fullPath = path.resolve(config.outputPath, "full");

  ensureDirSync(fullPath);

  const { ast, dynamicModulesGraph, mainChunkCode } = fullTransformer(
    config,
    originalAst
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

  emptyDirSync(getCacheManifestDir());

  return assets;
};

export default buildFull;
