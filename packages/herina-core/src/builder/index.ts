import { HerinaConfig, HerinaVersionsInfo } from "..";
import { ChunkAsset } from "./chunkAssetAnalysers";

export { default as buildUpdate } from "./buildUpdate";

export type HerinaUpdateBuiilder = (
  config: HerinaConfig,
  info: HerinaVersionsInfo,
  bundlePath: string,
  currentCommitHash: string,
  previousCommitHash: string
) => Promise<Record<string, ChunkAsset[]>>;
