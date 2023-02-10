import { Node } from "@babel/types";
import { HerinaConfigInternal, HerinaVersionsInfo } from "@herina-rn/shared";
import { ChunkAsset } from "./chunkAnalysers";

export { default as buildUpdate } from "./buildUpdate";

export type HerinaUpdateBuiilder = (
  config: HerinaConfigInternal,
  info: HerinaVersionsInfo,
  bundlePath: string,
  currentCommitHash: string,
  previousCommitHash: string,
  ast: Node
) => Promise<Record<string, ChunkAsset[]>>;
