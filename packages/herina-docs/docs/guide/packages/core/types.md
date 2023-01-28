# Types

```typescript
export interface HerinaConfig {
  environment: "production" | "development";
  baseUrl: string;
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
}
```

```typescript
export interface HerinaManifest {
  maxId: number;
  chunks: Record<string, Record<string, number>>;
  chunksReversed: Record<string, Record<number, string>>;
}
```

```typescript
export type HerinaConfigManualChunks =
  | Record<string, string[]>
  | ((path: string) => string);
```

```typescript
export interface HerinaVersionsHistoryItem {
  versionNum: number;
  commitHash: string;
  filePath: string;
}
```

```typescript
export interface HerinaVersions {
  currentVersionNum: number;
  currentCommitHash: string;
  previousCommitHash: string;
  history: HerinaVersionsHistoryItem[];
}
```