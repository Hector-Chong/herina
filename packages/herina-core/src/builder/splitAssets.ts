import { HerinaConfig, HerinaVersionsInfo } from "@herina-rn/shared";

const transformAssetPathsToRelative = (
  config: HerinaConfig,
  assets: Record<number, string>
) => {
  Object.keys(assets).forEach((id) => {
    const filePath = assets[+id];

    assets[id] = filePath.replace(config.root, "");
  });
};

const splitAssets = (config: HerinaConfig, info: HerinaVersionsInfo) => {
  const currentAssets = info.versions[0].assets;

  transformAssetPathsToRelative(config, currentAssets);
};

export default splitAssets;
