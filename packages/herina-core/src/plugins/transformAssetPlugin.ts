import { HerinaPlugin } from ".";
import assetsTransformer from "../bundleTransformer/assetsTransformer";

const transformAssetPlugin: HerinaPlugin = {
  name: "transformAssetPlugin",
  afterBundleBuild(ast) {
    assetsTransformer(ast);
  }
};

export default transformAssetPlugin;
