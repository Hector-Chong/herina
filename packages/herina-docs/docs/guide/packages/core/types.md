# 类型声明

```typescript
type HerinaSupportPlatforms = "ios" | "android";

type HerinaBuildEnvironment = "production" | "development";

interface HerinaConfig {
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
  updateType?: HerinaUpdateType$1;
  currentReleaseVersionNum?: number;
  checkNativeChange?: boolean;
  iosSourcePath?: string;
  androidSourcePath?: string;
  metaInfo?: any;
}
```

```typescript
interface HerinaManifest {
  maxId: number;
  chunks: Record<string, Record<string, number>>;
  chunksReversed: Record<string, Record<number, string>>;
}
```

```typescript
interface HerinaVersionsItem {
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
```

```typescript
interface HerinaVersionsInfo {
  releaseVersionNums: number[];
  versions: HerinaVersionsItem[];
  isSuccessFul?: boolean;
}
```

```typescript
enum HerinaUpdateType {
  FULL,
  INCREMENTAL,
  ALL
}
```
