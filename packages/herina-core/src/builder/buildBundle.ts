import { buildBundleWithConfig } from "@react-native-community/cli-plugin-metro";
import { HerinaConfigInternal } from "@herina-rn/shared";
import createBuildConfig from "../factory/createBuildConfig";

const buildBundle = async (config: HerinaConfigInternal) => {
  const { args, buildConfig } = await createBuildConfig(config);

  await buildBundleWithConfig(args, buildConfig);

  return args.bundleOutput;
};

export default buildBundle;
