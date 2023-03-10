import { HerinaConfigInternal, HerinaManifest } from "@herina-rn/shared";
import {
  createManifestIfNotExist,
  getCacheManifestDir
} from "../utils/manifest";
import { getManifestChunks } from "../utils/file";
import {
  emptyDirSync,
  existsSync,
  readdirSync,
  readJsonSync,
  writeJsonSync
} from "fs-extra";
import { join } from "path";
import { defaultsDeep } from "lodash";

export const manifest: HerinaManifest = createManifestIfNotExist();

export const removeDuplicatedDependencies = (manifest: HerinaManifest) => {
  const { mainChunk, dynamicChunk, assetsChunk } = getManifestChunks(manifest);

  const chunksToRemove = { ...dynamicChunk, ...assetsChunk };

  Object.keys(chunksToRemove).map((filePath) => {
    if (mainChunk.hasOwnProperty(filePath)) {
      delete mainChunk[filePath];
    }
  });

  return manifest;
};

const chunkToSplit = ["dynamic", "assets"];

export const removeSplittingChunkFromMain = (manifest: HerinaManifest) => {
  const { mainChunk, mainChunkReversed } = getManifestChunks(manifest);

  chunkToSplit.forEach((chunkName) => {
    const chunk = manifest.chunks[chunkName];

    if (chunk) {
      Object.keys(chunk).map((filePath) => {
        const id = (chunk[filePath] = mainChunk[filePath]);

        if (id) {
          manifest.chunksReversed[chunkName] =
            manifest.chunksReversed[chunkName] || {};

          manifest.chunksReversed[chunkName][id] = filePath;

          delete mainChunk[filePath];
          delete mainChunkReversed[id];
        }
      });
    }
  });

  return manifest;
};

export const combineManifestFromMetroWorkers = (
  config: HerinaConfigInternal
) => {
  const manifest = createManifestIfNotExist(config);

  const manifestDir = getCacheManifestDir();

  if (!existsSync(manifestDir)) return manifest;

  const workerManifests = readdirSync(manifestDir);

  workerManifests
    .filter((path) => path.endsWith(".json"))
    .forEach((path) => {
      const workerMf = readJsonSync(join(manifestDir, path));

      defaultsDeep(manifest, workerMf);
    });

  emptyDirSync(manifestDir);

  return manifest;
};

export const calculateMaxId = (manifest: HerinaManifest) =>
  Object.keys(manifest.chunks).reduce(
    (prev, cur) => prev + Object.values(manifest.chunks[cur]).length,
    0
  );

export const updateManifest = (config: HerinaConfigInternal) => {
  manifest.maxId = calculateMaxId(manifest);

  writeJsonSync(config.manifestPath, manifest);
};
