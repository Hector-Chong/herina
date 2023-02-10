import { HerinaConfigInternal, HerinaVersionsInfo } from "@herina-rn/shared";
import { constants, copyFileSync, ensureDirSync, existsSync } from "fs-extra";
import { extname, resolve } from "path";

const transformAssetPathsToRelative = (
  config: HerinaConfigInternal,
  assets: Record<number, string>
) => {
  Object.keys(assets).forEach((id) => {
    const filePath = assets[+id];

    if (filePath) {
      assets[id] = filePath.replace(config.root, "");

      if (assets[id][0] === "/") {
        assets[id] = assets[id].slice(1);
      }
    }
  });
};

const splitAssets = async (
  config: HerinaConfigInternal,
  info: HerinaVersionsInfo
) => {
  const sourceDir = config.root;
  const assetsDir = resolve(config.outputPath, "assets");

  ensureDirSync(sourceDir);
  ensureDirSync(assetsDir);

  const currentAssets = info.versions[0].assets;

  transformAssetPathsToRelative(config, currentAssets);

  for (const id in currentAssets) {
    const filePath = currentAssets[id];

    if (filePath) {
      const tempFilePath = resolve(sourceDir, filePath);
      const extension = extname(tempFilePath);
      const newFileName = id + extension;
      const newFilePath = resolve(assetsDir, newFileName);

      if (existsSync(tempFilePath)) {
        copyFileSync(tempFilePath, newFilePath, constants.COPYFILE_FICLONE);
      }

      currentAssets[id] = newFileName;
    }
  }
};

export default splitAssets;
