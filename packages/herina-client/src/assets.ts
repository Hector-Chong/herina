import AssetRegistry from "@react-native/assets-registry/registry";
import Herina from "./native";
import { pickScale } from "react-native/Libraries/Image/AssetUtils";

const PixelRatio = require("react-native/Libraries/Utilities/PixelRatio");

interface RegisterAssetParams {
  httpServerLocation: string;
  width: number;
  height: number;
  scales: number;
  hash: string;
  name: string;
  type: string;
  id?: number;
  uri?: string;
}

let assetStoreURL: string;

export const registerAsset = (
  params: RegisterAssetParams | RegisterAssetParams[]
) => {
  if (!assetStoreURL) {
    assetStoreURL = Herina.getConstants().assetsURL;
  }

  if (!Array.isArray(params)) {
    params = [params];
  }

  return params.map((param) => {
    if (!param.id) {
      return AssetRegistry.registerAsset(params);
    }

    param.uri = `${assetStoreURL}/${param.id}.${param.type}`;

    param.scales = pickScale(param.scales, PixelRatio.get());

    return param;
  });
};
