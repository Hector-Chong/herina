import { HerinaManifest } from "@herina/shared";
import { getManifestChunks } from "../utils/file";

export const removeDuplicatedDependencies = (manifest: HerinaManifest) => {
  const dynamicChunk = manifest.chunks.dynamic;
  const mainChunk = manifest.chunks.main;

  if (dynamicChunk) {
    Object.keys(dynamicChunk).map((filePath) => {
      if (mainChunk.hasOwnProperty(filePath)) {
        delete mainChunk[filePath];
      }
    });
  }

  return manifest;
};

export const addDynamicChunkReversedToManifest = (manifest: HerinaManifest) => {
  const { mainChunk, dynamicChunk, mainChunkReversed } =
    getManifestChunks(manifest);

  Object.keys(dynamicChunk).forEach((filePath) => {
    const id = (dynamicChunk[filePath] = mainChunk[filePath]);

    if (id) {
      manifest.chunksReversed.dynamic = manifest.chunksReversed.dynamic || {};

      manifest.chunksReversed.dynamic[id] = filePath;

      delete mainChunk[filePath];
      delete mainChunkReversed[id];
    }
  });

  return manifest;
};
