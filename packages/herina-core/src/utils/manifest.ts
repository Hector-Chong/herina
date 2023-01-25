import { HerinaConfig } from "@herina/shared";

const fs = require("fs-extra");

export const createManifestIfNotExist = (config?: HerinaConfig) => {
  if (config && fs.existsSync(config.manifestPath)) {
    return fs.readJsonSync(config.manifestPath);
  } else {
    const manifest = {
      maxId: 0,
      chunks: {},
      chunksReversed: {}
    };

    if (config) {
      fs.ensureFileSync(config.manifestPath);

      fs.writeJsonSync(config.manifestPath, manifest);
    }

    return manifest;
  }
};
