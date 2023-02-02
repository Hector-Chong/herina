import { HerinaUpdateType } from "packages/shared/src";

type HerinaSupportPlatforms = "ios" | "android";

type HerinaBuildEnvironment = "production" | "development";

export interface HerinaConfig {
  environment: HerinaBuildEnvironment;
  baseUrl: string | Record<HerinaSupportPlatforms, string>;
  entryFile: string;
  outputPath: string;
  clean?: boolean;
  minify?: boolean;
  root?: string;
  platform: HerinaSupportPlatforms;
  manifestPath: string;
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
  filePath: {
    full: string;
    incremental: string;
    vendor: string;
  };
  assets: Record<number, string>;
  metaInfo?: string;
}

export interface HerinaVersionsInfo {
  releaseVersionNums: number[];
  versions: HerinaVersionsItem[];
}

export interface AppVersionConfig {
  useOriginal: false;
  originalVersionNum: number;
  originCommitHash: string;
  versionNum: number;
  commitHash: string;
  nextVersionNum: number;
  nextCommitHash: string;
  isBundleAvailable: boolean;
  isIncrementalAvailable: boolean;
  incrementalsToApply: string[];
}
