declare module "metro-babel-transformer" {
  import { Recordable } from "@herina-rn/shared";
  import { Node } from "@babel/types";

  export type CustomTransformOptions = Recordable;

  export type TransformProfile = "default" | "hermes-stable" | "hermes-canary";

  export type BabelTransformerOptions = Readonly<{
    customTransformOptions?: CustomTransformOptions;
    dev: boolean;
    enableBabelRCLookup?: boolean;
    enableBabelRuntime: boolean | string;
    extendsBabelConfigPath?: string;
    experimentalImportSupport?: boolean;
    hermesParser?: boolean;
    hot: boolean;
    inlineRequires: boolean;
    nonInlinedRequires?: ReadonlyArray<string>;
    minify: boolean;
    unstable_disableES6Transforms?: boolean;
    platform?: string;
    projectRoot: string;
    publicPath: string;
    unstable_transformProfile?: TransformProfile;
    globalPrefix: string;
  }>;

  export type BabelTransformerArgs = Readonly<{
    filename: string;
    options: BabelTransformerOptions;
    plugins?: any;
    src: string;
  }>;

  export type BabelTransformer = {
    transform: (args: BabelTransformerArgs) => {
      ast: Node;
      functionMap?: {
        names: ReadonlyArray<string>;
        mappings: string;
      };
    };
    getCacheKey?: () => string;
  };

  export const transform: BabelTransformer["transform"];

  export const getCacheKey: BabelTransformer["getCacheKey"];
}
