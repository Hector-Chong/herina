import { resolve } from "path";
import { HerinaConfig, HerinaManifest } from "@herina-rn/shared";

import { getChunkHashedName, getManifestChunks } from "../utils/file";
import { generateRandomStr, md5 } from "../utils/str";

export interface ChunkAsset {
  filename: string;
  code: string;
  path: string;
}

export const defaultAnalyser = (
  chunkName: string,
  config: HerinaConfig,
  code: string
) => {
  const filename = `${generateRandomStr(8)}.${chunkName}.chunk.js`;
  const path = resolve(config.outputPath, chunkName, filename);

  return [{ filename, code, path }];
};

export const dynamicChunkAnalyser = (
  config: HerinaConfig,
  manifest: HerinaManifest,
  dynamicModulesGraph: Map<
    string,
    { code: string; moduleId: number; dependenciesId: number[] }
  >
): ChunkAsset[] => {
  const { dynamicChunkReversed } = getManifestChunks(manifest);
  const assets: ChunkAsset[] = [];

  for (const [filePath, cache] of dynamicModulesGraph.entries()) {
    const { code, moduleId, dependenciesId } = cache;
    const chunkName = getChunkHashedName(filePath, "dynamic");

    const insertModuleToChunk = (() => {
      let modules = "";

      return (id: number, moduleCode: string, dependencyFilePath: string) => {
        modules = modules.concat(`${id}:()=>${moduleCode},`);

        modules = modules.replaceAll(
          dependencyFilePath,
          getChunkHashedName(dependencyFilePath, "dynamic")
        );

        return `loadChunkModules("${chunkName}",{${modules}})`;
      };
    })();

    dependenciesId.forEach((dependencyId) => {
      const dependencyFilePath = dynamicChunkReversed[dependencyId];

      if (dynamicModulesGraph.has(dependencyFilePath)) {
        insertModuleToChunk(
          dependencyId,
          dynamicModulesGraph.get(dependencyFilePath).code,
          dependencyFilePath
        );
      }
    });

    const path = resolve(config.outputPath, "dynamic", chunkName);
    const chunkCode = insertModuleToChunk(moduleId, code, filePath);

    assets.push({ filename: chunkName, code: chunkCode, path });
  }

  return assets;
};
