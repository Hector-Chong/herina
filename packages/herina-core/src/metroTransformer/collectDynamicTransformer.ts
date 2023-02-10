import { MetroTranformerParams } from ".";
import { isArrayWithLength, Recordable } from "@herina-rn/shared";

const collectDynamicTransformer = ({
  projectRoot,
  filename,
  res,
  manifest
}: MetroTranformerParams) => {
  const filePath = `${projectRoot}/${filename}`;
  const { dependencies } = res;

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
      });
    }
  }

  return res;
};

export default collectDynamicTransformer;
