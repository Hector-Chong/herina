import fs from "fs-extra";
import path from "path";
import { HerinaConfigInternal, HerinaManifest } from "@herina-rn/shared";
import { getHerinaCachePath } from "./file";
import { defaultsDeep } from "lodash";

export const createManifestIfNotExist = (
  config?: HerinaConfigInternal
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
  config: HerinaConfigInternal,
  manifest: HerinaManifest
) => {
  const sourceManifest = createManifestIfNotExist(config);

  defaultsDeep(manifest, sourceManifest);

  if (!manifest.maxId) {
    manifest.maxId = sourceManifest.maxId;
  }

  return manifest;
};

export const createDefaultManifest = () => ({
  maxId: 0,
  chunks: {},
  chunksReversed: {}
});

export const getCacheManifestDir = () =>
  path.join(getHerinaCachePath(), "manifest");

export const findHerinaModuleId = (() => {
  let id: number;

  return (manifest: HerinaManifest) => {
    if (id) return id;

    Object.keys(manifest.chunks.vendor).forEach((key) => {
      if (key.match(/@herina\-rn\/client\/src\/index/)) {
        id = manifest.chunks.vendor[key];
      }
    });

    return id;
  };
})();
