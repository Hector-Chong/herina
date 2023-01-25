import { getGlobalContext } from "../utils/runtime";
import loadChunk from "./loadChunk";

const context = getGlobalContext();

const loadDynamicModule = async (moduleId: number, chunkName: string) => {
  if (!context.modules[moduleId]) {
    await loadChunk(chunkName);
  }

  return context.__r(moduleId);
};

module.exports = loadDynamicModule;
