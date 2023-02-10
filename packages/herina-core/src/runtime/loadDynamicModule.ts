import { getGlobalContext } from "@herina-rn/core/src/utils/runtime";
import loadChunk from "./loadChunk";

const context = getGlobalContext();

const loadedDynamicModuleIds = new Set<number>();

const loadDynamicModule = async (moduleId: number, chunkName: string) => {
  if (!context.modules[moduleId] || chunkName.endsWith("dynamic.chunk.js")) {
    if (!loadedDynamicModuleIds.has(moduleId)) {
      await loadChunk(chunkName);

      loadedDynamicModuleIds.add(moduleId);
    }
  }

  return context.__r(moduleId);
};

module.exports = loadDynamicModule;
