declare module "metro-transform-worker" {
  import { Recordable } from "@herina-rn/shared";

  export type DynamicRequiresBehavior = "throwAtRuntime" | "reject";

  type MinifierConfig = Recordable;

  type CustomTransformOptions = Recordable;

  export type AllowOptionalDependenciesWithOptions = {
    exclude: string[];
  };

  export type AllowOptionalDependencies =
    | boolean
    | AllowOptionalDependenciesWithOptions;

  export type JsTransformerConfig = Readonly<{
    assetPlugins: ReadonlyArray<string>;
    assetRegistryPath: string;
    asyncRequireModulePath: string;
    babelTransformerPath: string;
    dynamicDepsInPackages: DynamicRequiresBehavior;
    enableBabelRCLookup: boolean;
    enableBabelRuntime: boolean | string;
    globalPrefix: string;
    hermesParser: boolean;
    minifierConfig: MinifierConfig;
    minifierPath: string;
    optimizationSizeLimit: number;
    publicPath: string;
    allowOptionalDependencies: AllowOptionalDependencies;
    unstable_collectDependenciesPath: string;
    unstable_dependencyMapReservedName?: string;
    unstable_disableModuleWrapping: boolean;
    unstable_disableNormalizePseudoGlobals: boolean;
    unstable_compactOutput: boolean;
    unstable_allowRequireContext: boolean;
  }>;

  export type Type = "script" | "module" | "asset";

  export type TransformProfile = "default" | "hermes-stable" | "hermes-canary";

  export type JsTransformOptions = Readonly<{
    customTransformOptions?: CustomTransformOptions;
    dev: boolean;
    experimentalImportSupport?: boolean;
    hot: boolean;
    inlinePlatform: boolean;
    inlineRequires: boolean;
    minify: boolean;
    nonInlinedRequires?: ReadonlyArray<string>;
    platform?: string;
    runtimeBytecodeVersion?: number;
    type: Type;
    unstable_disableES6Transforms?: boolean;
    unstable_transformProfile: TransformProfile;
  }>;

  export type TransformResponse = Readonly<{
    dependencies: ReadonlyArray<Recordable>;
    output: ReadonlyArray<JsOutput | Recordable>;
  }>;

  type GeneratedCodeMapping = [number, number];
  type SourceMapping = [number, number, number, number];
  type SourceMappingWithName = [number, number, number, number, string];

  export type MetroSourceMapSegmentTuple =
    | SourceMappingWithName
    | SourceMapping
    | GeneratedCodeMapping;

  type JSFileType = "js/script" | "js/module" | "js/module/asset";

  export type FBSourceFunctionMap = {
    names: ReadonlyArray<string>;
    mappings: string;
  };

  export type JsOutput = Readonly<{
    data: Readonly<{
      code: string;
      lineCount: number;
      map: MetroSourceMapSegmentTuple[];
      functionMap?: FBSourceFunctionMap;
    }>;
    type: JSFileType;
  }>;

  export const getCacheKey: (config: JsTransformerConfig) => string;

  export const transform: (
    config: JsTransformerConfig,
    projectRoot: string,
    filename: string,
    data: Buffer,
    options: JsTransformOptions
  ) => Promise<TransformResponse>;
}
