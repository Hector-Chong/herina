import { buildBundleWithConfig } from "@react-native-community/cli-plugin-metro";
import { HerinaConfig } from "@herina-rn/shared";
import createBuildConfig from "../factory/createBuildConfig";
import { calculateMaxId, manifest } from "./manifest";

const buildBundle = async (config: HerinaConfig) => {
  const { args, buildConfig } = await createBuildConfig(config);

  await buildBundleWithConfig(args, buildConfig);

  manifest.maxId = calculateMaxId(manifest);

  return args.bundleOutput;
};

export default buildBundle;
