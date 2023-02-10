import { HerinaBuildEventNames } from "@herina-rn/shared";
import { HerinaPlugin } from ".";
import HerinaEventManager from "../events";

class PluginManager {
  private plugins: Map<string, HerinaPlugin> = new Map();

  constructor(plugins?: HerinaPlugin[]) {
    if (plugins) {
      if (Array.isArray(plugins)) {
        plugins.forEach((plugin) => {
          this.register(plugin);
        });
      }
    }
  }

  public register(plugin: HerinaPlugin) {
    this.plugins.set(plugin.name, plugin);

    Object.keys(plugin)
      .filter((key) => key !== "name")
      .forEach((key) => {
        const handler = plugin[key];

        HerinaEventManager.on(key as HerinaBuildEventNames, handler);
      });
  }

  public remove(plugin: HerinaPlugin) {
    this.plugins.delete(plugin.name);
  }
}

export default PluginManager;
