import { InstalledChunks } from "./loadChunk";

const loadChunkModules = (
  chunkName: string,
  modules: Record<number, Function>
) => {
  const context = global;

  let installedChunks: InstalledChunks = context.installedChunks || {};

  const chunkLoading = installedChunks[chunkName];

  if (chunkLoading && !chunkLoading.loaded) {
    const modulesArr = [];

    Object.keys(modules).forEach((id) => {
      const factory = modules[id];

      modulesArr.push({
        id,
        factory
      });
    });

    chunkLoading.loadModules(modulesArr);
  }

  return chunkName;
};

export default loadChunkModules;
