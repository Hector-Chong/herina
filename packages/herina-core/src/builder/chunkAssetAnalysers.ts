import { resolve } from "path";
import { HerinaConfig, HerinaManifest } from "@herina-rn/shared";

import { getChunkHashedName, getManifestChunks } from "../utils/file";

export interface ChunkAsset {
  filename: string;
  code: string;
  path: string;
}

export const mainChunkAnalyser = (
  config: HerinaConfig,
  code: string
): ChunkAsset[] => {
  const filename = "main.chunk.js";
  const path = resolve(config.outputPath, filename);

  return [{ filename, code, path }];
};

export const vendorChunkAnalyser = (
  config: HerinaConfig,
  code: string
): ChunkAsset[] => {
  const filename = "vendor.chunk.js";
  const path = resolve(config.outputPath, filename);

  if (config.environment === "production") {
    const declaration = "var e=o(),t={}";

    code = code.replace(declaration, `var e=o();r.modules=e;var t={}`);
  } else {
    const declaration = "var modules = clear();";

    code = code.replace(declaration, `${declaration}global.modules = modules;`);
  }

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

    const path = resolve(config.outputPath, chunkName);
    const chunkCode = insertModuleToChunk(moduleId, code, filePath);

    assets.push({ filename: chunkName, code: chunkCode, path });
  }

  return assets;
};
