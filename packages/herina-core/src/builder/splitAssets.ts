import { HerinaConfig, HerinaVersionsInfo } from "@herina-rn/shared";
import { copyFileSync, ensureDirSync } from "fs-extra";
import { extname, resolve } from "path";
import { generateRandomStr, md5 } from "../utils/str";

const transformAssetPathsToRelative = (
  config: HerinaConfig,
  assets: Record<number, string>
) => {
  Object.keys(assets).forEach((id) => {
    const filePath = assets[+id];

    assets[id] = filePath.replace(config.root, "");

    if (assets[id][0] === "/") {
      assets[id] = assets[id].slice(1);
    }
  });
};

const splitAssets = (config: HerinaConfig, info: HerinaVersionsInfo) => {
  const sourceDir = config.root;
  const assetsDir = resolve(config.outputPath, "assets");

  ensureDirSync(sourceDir);
  ensureDirSync(assetsDir);

  const currentAssets = info.versions[0].assets;

  transformAssetPathsToRelative(config, currentAssets);

  Object.keys(currentAssets).map((id) => {
    const filePath = currentAssets[id];

    const tempFilePath = resolve(sourceDir, filePath);
    const extension = extname(tempFilePath);
    const newFileName = md5(generateRandomStr(10)) + extension;

    const newFilePath = resolve(assetsDir, newFileName);

    copyFileSync(tempFilePath, newFilePath);

    currentAssets[id] = newFileName;
  });
};

export default splitAssets;
