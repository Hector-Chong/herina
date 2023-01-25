import { HerinaConfig } from "@herina-rn/shared";
import {
  JsTransformerConfig,
  JsTransformOptions,
  TransformResponse,
  transform as metroTransform,
  getCacheKey
} from "metro-transform-worker";
import { getParsedConfig } from "../utils/file";
import appVersionConfigTransformer from "./appVersionConfigTransformer";
import changeDynamicNameTransformer from "./changeDynamicNameTransformer";
import collectDynamicTransformer from "./collectDynamicTransformer";

export interface MetroTranformerParams {
  herinaConfig: HerinaConfig;
  config: JsTransformerConfig;
  projectRoot: string;
  filename: string;
  data: Buffer;
  options: JsTransformOptions;
  res: TransformResponse;
}

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
    res
  };

  collectDynamicTransformer(params);

  changeDynamicNameTransformer(params);

  await appVersionConfigTransformer(params);

  return res;
};

module.exports = { transform, getCacheKey };
