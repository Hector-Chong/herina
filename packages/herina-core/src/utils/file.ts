import {
  ensureFileSync,
  readFileSync,
  readJsonSync,
  writeFileSync
} from "fs-extra";
import { join, resolve } from "path";
import { isProd } from "./runtime";
import { md5, HerinaManifest, HerinaConfigInternal } from "@herina-rn/shared";

export const getHerinaCachePath = () =>
  resolve(__dirname, isProd() ? "../src/.herina" : "../.herina");

export const getConfigFilePath = () =>
  join(getHerinaCachePath(), "config.json");

export const getParsedConfig = (): HerinaConfigInternal => {
  return readJsonSync(getConfigFilePath());
};

export const getChunkHashedName = (filePath: string, chunkName: string) =>
  `${md5(filePath).substring(0, 6)}.${chunkName}.chunk.js`;

export const getManifestChunks = (manifest: HerinaManifest) => {
  const { chunks, chunksReversed } = manifest;

  return {
    mainChunk: chunks.main || {},
    dynamicChunk: chunks.dynamic || {},
    vendorChunk: chunks.vendor || {},
    assetsChunk: chunks.assets || {},
    mainChunkReversed: chunksReversed.main || {},
    dynamicChunkReversed: chunksReversed.dynamic || {},
    vendorChunkReversed: chunksReversed.vendor || {},
    assetsChunkReversed: chunksReversed.assets || {}
  };
};

export const createFileWithReplcedText = (
  sourcePath: string,
  targetPath: string,
  text: string,
  slotName = "#slot"
) => {
  const stream = readFileSync(sourcePath);
  const data = stream.toString().replaceAll(slotName, text);

  ensureFileSync(targetPath);

  return writeFileSync(targetPath, data);
};
