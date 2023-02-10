import generate from "@babel/generator";
import {
  ChunkAsset,
  defaultAnalyser,
  dynamicChunkAnalyser
} from "./chunkAnalysers";
import minifyCode from "./minifyCode";
import { manifest } from "./manifest";
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
  const { ast, dynamicModulesGraph, mainChunkCode } = fullTransformer(
    config,
    originalAst
  );

  const { code: vendorCode } = generate(ast);

  const assets: Record<string, ChunkAsset[]> = {
    dynamic: dynamicChunkAnalyser(config, manifest, dynamicModulesGraph),
    main: defaultAnalyser("main", config, mainChunkCode),
    vendor: defaultAnalyser("vendor", config, vendorCode)
  };

  if (config.minify) {
    await minifyCode(assets);
  }

  return assets;
};

export default buildFull;
