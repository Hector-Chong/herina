import { Node } from "@babel/types";
import { HerinaConfig, HerinaVersionsInfo } from "..";
import { ChunkAsset } from "./chunkAssetAnalysers";

export { default as buildUpdate } from "./buildUpdate";

export type HerinaUpdateBuiilder = (
  config: HerinaConfig,
  info: HerinaVersionsInfo,
  bundlePath: string,
  currentCommitHash: string,
  previousCommitHash: string,
  ast: Node
) => Promise<Record<string, ChunkAsset[]>>;
