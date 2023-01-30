import { MetroConfig } from "@react-native-community/cli-plugin-metro";
import { resolve } from "path";
import { HerinaConfig } from "@herina-rn/shared";
import { merge } from "lodash";
import getReactNativePolyfills from "@react-native/js-polyfills";
import { isProd } from "../utils/runtime";
import { createModuleIdFactory } from "../serializer/createModuleIdFactory";
import getRunModuleStatement from "../serializer/getRunModuleStatement";

const getBaseDir = (isProduction: boolean) => (isProduction ? "." : "../src");

const createBabelTransformerPath = (isProduction: boolean) =>
  resolve(
    __dirname,
    getBaseDir(isProduction),
    isProduction ? "babelTransformer.js" : `babelTransformer/index.ts`
  );

const createTransformerPath = (isProduction: boolean) =>
  resolve(
    __dirname,
    getBaseDir(isProduction),
    isProduction ? "metroTransformer.js" : `metroTransformer/index.ts`
  );

const polyfills = ["rewirteModuleRequire", "rewriteModuleDefiner"];

const createPoliyfillsPath = (isProduction: boolean) =>
  polyfills.map((name) =>
    resolve(__dirname, isProduction ? "../src" : "..", `polyfills/${name}.ts`)
  );

const createDefaultMetroConfig = (config: HerinaConfig) => {
  const isRuntimeDev = config.environment === "development";

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          dev: isRuntimeDev,
          experimentalImportSupport: true,
          inlineRequires: true
        }
      }),
      asyncRequireModulePath: resolve(
        __dirname,
        isProd() ? "../src" : "..",
        "runtime/loadDynamicModule.ts"
      ),
      babelTransformerPath: createBabelTransformerPath(isProd()),
      hermesParser: false
    },
    transformerPath: createTransformerPath(isProd()),
    serializer: {
      createModuleIdFactory: () => createModuleIdFactory(config),
      getRunModuleStatement: getRunModuleStatement(config),
      getPolyfills: () => [
        ...createPoliyfillsPath(isProd()),
        ...getReactNativePolyfills()
      ]
    }
  };
};

const createMetroConfig = (
  config: HerinaConfig,
  userMetroConfig?: MetroConfig
) => {
  const defaultMetroConfig = createDefaultMetroConfig(config);

  return merge(userMetroConfig, defaultMetroConfig);
};

export default createMetroConfig;
