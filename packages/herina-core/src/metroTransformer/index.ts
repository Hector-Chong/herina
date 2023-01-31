import { HerinaConfig, HerinaManifest } from "@herina-rn/shared";
import {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
  transform as metroTransform,
  getCacheKey
} from "metro-transform-worker";
import fs from "fs-extra";
import { createDefaultManifest, getCacheManifestDir } from "../utils/manifest";
import { getParsedConfig } from "../utils/file";
import appVersionConfigTransformer from "./appVersionConfigTransformer";
import changeDynamicNameTransformer from "./changeDynamicNameTransformer";
import collectAssetTransformer from "./collectAssetTransformer";
import collectDynamicTransformer from "./collectDynamicTransformer";
import { generateRandomStr } from "src/utils/str";
import path from "path";

export interface MetroTranformerParams {
  herinaConfig: HerinaConfig;
  config: JsTransformerConfig;
  projectRoot: string;
  filename: string;
  data: Buffer;
  options: JsTransformOptions;
  res: TransformResponse;
  manifest: HerinaManifest;
}

const manifestDir = getCacheManifestDir();
const manifestFilePath = path.join(manifestDir, `${generateRandomStr(5)}.json`);
const manifest = createDefaultManifest();

fs.ensureDirSync(manifestDir);

const transform = async (
  config: JsTransformerConfig,
  projectRoot: string,
  filename: string,
  data: Buffer,
  options: JsTransformOptions
): Promise<TransformResponse> => {
  const res = await metroTransform(
    config,
    projectRoot,
    filename,
    data,
    options
  );

  const params = {
    herinaConfig: getParsedConfig(),
    config,
    projectRoot,
    filename,
    data,
    options,
    res,
    manifest
  };

  collectDynamicTransformer(params);

  changeDynamicNameTransformer(params);

  await appVersionConfigTransformer(params);

  if (options.type === "asset") {
    collectAssetTransformer(params);
  }

  fs.writeJsonSync(manifestFilePath, manifest);

  return res;
};

module.exports = { transform, getCacheKey };
