import fs from "fs-extra";
import path from "path";
import { HerinaConfig, HerinaManifest } from "@herina-rn/shared";
import { getHerinaCachePath, getParsedConfig } from "./file";
import { defaultsDeep } from "lodash";

export const createManifestIfNotExist = (
  config?: HerinaConfig
): HerinaManifest => {
  if (config && fs.existsSync(config.manifestPath)) {
    return fs.readJsonSync(config.manifestPath);
  } else {
    const manifest = createDefaultManifest();

    if (config) {
      fs.ensureFileSync(config.manifestPath);

      fs.writeJsonSync(config.manifestPath, manifest);
    }

    return manifest;
  }
};

export const overloadManifest = (
  config: HerinaConfig,
  manifest: HerinaManifest
) => {
  return defaultsDeep(manifest, createManifestIfNotExist(config));
};

export const createDefaultManifest = () => ({
  maxId: 0,
  chunks: {},
  chunksReversed: {}
});

export const getCacheManifestDir = () =>
  path.join(getHerinaCachePath(), "manifest");
