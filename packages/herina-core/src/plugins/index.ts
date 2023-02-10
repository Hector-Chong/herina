import { HerinaBuildEvents } from "@herina-rn/shared";
import PluginManager from "./manager";
import transformAssetPlugin from "./transformAssetPlugin";

export interface HerinaPlugin extends Partial<HerinaBuildEvents> {
  name: string;
}

const builtinPlugins = [transformAssetPlugin];

const HerinaPluginManager = new PluginManager(builtinPlugins);

export default HerinaPluginManager;
