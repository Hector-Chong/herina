import { MetroTranformerParams } from ".";
import fs from "fs-extra";
import { createManifestIfNotExist } from "../utils/manifest";
import { isArrayWithLength } from "../utils/arr";
import { Recordable } from "@herina-rn/shared";

const collectDynamicTransformer = ({
  herinaConfig,
  projectRoot,
  filename,
  res
}: MetroTranformerParams) => {
  const filePath = `${projectRoot}/${filename}`;
  const { dependencies } = res;
  const manifest = createManifestIfNotExist();

  let manifestModified = false;

  if (!filePath.match(/node_modules/)) {
    if (isArrayWithLength(dependencies)) {
      const asyncDependencies =
        dependencies.filter(
          (dependency: Recordable) => dependency.data.asyncType === "async"
        ) || [];

      asyncDependencies.forEach((dependency: Recordable) => {
        const dependencyFilePath = dependency.name;

        manifest.chunks.dynamic = manifest.chunks.dynamic || {};
        manifest.chunks.dynamic[dependencyFilePath] = 0;

        manifestModified = true;
      });
    }
  }

  if (manifestModified) {
    fs.writeJsonSync(herinaConfig.manifestPath, manifest);
  }

  return res;
};

export default collectDynamicTransformer;
