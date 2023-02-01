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
  platform: "ios" | "android";
  manifestPath: string;
  incremental?: {
    previousCommitHash?: string;
    currentCommitHash?: string;
    pure?: boolean;
    filePath?: string;
  };
  extensions?: string[];
  manualChunks?: HerinaConfigManualChunks;
  maxWorkers?: number;
  updateType?: HerinaUpdateType;
  checkNativeChange?: boolean;
  iosSourcePath?: string;
  androidSourcePath?: string;
  isRelease?: boolean;
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

export interface HerinaVersionsHistoryItem {
  versionNum: number;
  commitHash: string;
  filePath: string;
  assets: Record<number, string>;
  metaInfo?: string;
}

export interface HerinaVersions {
  currentVersionNum: number;
  currentCommitHash: string;
  previousCommitHash: string;
  releaseVersionNum: number[];
  assets: Record<number, string>;
  history: HerinaVersionsHistoryItem[];
  metaInfo?: string;
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
