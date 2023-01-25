import { resolve } from "path";
import { HerinaConfig, HerinaManifest } from "@herina/shared";
import { manifest } from "../builder/buildChunks";

const getChunkName = (config: HerinaConfig, modulePath: string) => {
  let chunkNameValue = "main";
  const { manualChunks } = config;
  const filePath = resolve(config.root, modulePath);

  if (
    filePath.match(
      /(node_modules|herina\/src\/runtime|herina\/src\/utils|@herina\/client\/src)/
    )
  ) {
    chunkNameValue = "vendor";
  } else {
    if (typeof manualChunks === "function") {
      chunkNameValue = manualChunks(filePath);
    } else if (manualChunks) {
      Object.keys(manualChunks).forEach((chunkName) => {
        const chunk = manualChunks[chunkName];

        Object.values(chunk).forEach((chunkFilePath) => {
          const filePathInChunk = resolve(config.root, chunkFilePath);

          if (filePathInChunk === filePath) {
            chunkNameValue = chunkName;
          }
        });
      });
    }
  }

  return chunkNameValue;
};

const recordModule = (chunk: string, moduleName: string, moduleId: number) => {
  manifest.maxId = moduleId;
  manifest.chunks[chunk] = manifest.chunks[chunk] || {};
  manifest.chunks[chunk][moduleName] = moduleId;

  manifest.chunksReversed[chunk] = manifest.chunksReversed[chunk] || {};
  manifest.chunksReversed[chunk][moduleId] = moduleName;
};

export const fileToIdMap = new Map<string, number>();

export const idToFileMap = new Map<number, string>();

export const createModuleIdFactory = (config: HerinaConfig) => {
  Object.keys(manifest.chunks).forEach((key) => {
    const modules = (manifest as HerinaManifest).chunks[key] || {};

    for (const [filePath, id] of Object.entries(modules)) {
      fileToIdMap.set(filePath, id);
      idToFileMap.set(id, filePath);
    }
  });

  let nextId = manifest.maxId + 1;

  return (path: string) => {
    let id = fileToIdMap.get(path);

    if (typeof id !== "number") {
      id = nextId++;
      fileToIdMap.set(path, id);
      idToFileMap.set(id, path);
    }

    recordModule(getChunkName(config, path), path, id);

    return id;
  };
};
