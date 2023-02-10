import { Node } from "@babel/traverse";
import { HerinaUpdateType } from "@herina-rn/shared";

export type HerinaSupportPlatforms = "ios" | "android";

export type HerinaBuildEnvironment = "production" | "development";

export interface HerinaConfig {
  environment: HerinaBuildEnvironment;
  baseUrl: string | Record<HerinaSupportPlatforms, string>;
  entryFile: string;
  outputPath: string | Record<HerinaSupportPlatforms, string>;
  clean?: boolean;
  minify?: boolean;
  root?: string;
  platform: HerinaSupportPlatforms;
  manifestPath: string | Record<HerinaSupportPlatforms, string>;
  previousCommitHash?: string;
  currentCommitHash?: string;
  extensions?: string[];
  manualChunks?: HerinaConfigManualChunks;
  maxWorkers?: number;
  updateType?: HerinaUpdateType;
  currentReleaseVersionNum?: number;
  checkNativeChange?: boolean;
  iosSourcePath?: string;
  androidSourcePath?: string;
  metaInfo?: any;
}

export interface HerinaConfigInternal extends HerinaConfig {
  baseUrl: string;
  outputPath: string;
  manifestPath: string;
}

export interface HerinaManifest {
  maxId: number;
  chunks: Record<string, Record<string, number>>;
  chunksReversed: Record<string, Record<number, string>>;
}

export type HerinaConfigManualChunks =
  | Record<string, string[]>
  | ((path: string) => string);

export interface HerinaVersionsItem {
  versionNum: number;
  commitHash: string;
  lastCommitHash: string;
  fileNames: {
    main: string;
    incremental: string;
    vendor: string;
  };
  assets: Record<number, string>;
  metaInfo?: string;
}

export interface HerinaVersionsInfo {
  releaseVersionNums: number[];
  versions: HerinaVersionsItem[];
  isSuccessFul?: boolean;
}

export interface AppVersionConfig {
  useOriginal: false;
  originalVersionNum: number;
  originCommitHash: string;
  versionNum: number;
  commitHash: string;
  nextVersionNum: number;
  nextCommitHash: string;
  isFullAvailable: boolean;
  isIncrementalAvailable: boolean;
  incrementalsToApply: string[];
  appliedVersionNums: number[];
  fullToApply?: HerinaVersionsItem;
}

export interface HerinaBuildEvents {
  afterBundleBuild: (ast: Node) => void;
}

export type HerinaBuildEventNames = keyof HerinaBuildEvents;
