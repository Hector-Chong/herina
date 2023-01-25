import {
  ensureFileSync,
  readFileSync,
  readJsonSync,
  writeFileSync
} from "fs-extra";
import { resolve } from "path";
import { isProd } from "./runtime";
import { md5 } from "./str";
import { HerinaConfig, HerinaManifest } from "@herina/shared";

export const getConfigFilePath = () => {
  const filePath = resolve(
    __dirname,
    isProd() ? "../src/.herina/config.json" : "../.herina/config.json"
  );

  return filePath;
};

export const getParsedConfig = (): HerinaConfig => {
  return readJsonSync(getConfigFilePath());
};

export const getChunkHashedName = (filePath: string, chunkName: string) =>
  `${md5(filePath).substring(0, 6)}.${chunkName}.chunk.js`;

export const getManifestChunks = (manifest: HerinaManifest) => {
  const { chunks, chunksReversed } = manifest;

  return {
    mainChunk: chunks.main || {},
    dynamicChunk: chunks.dynamic || {},
    vendorChunk: chunks.vendorChunk || {},
    mainChunkReversed: chunksReversed.main || {},
    dynamicChunkReversed: chunksReversed.dynamic || {},
    vendorChunkReversed: chunksReversed.vendor || {}
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
