import { MetroTranformerParams } from ".";

const collectAssetTransformer = ({
  projectRoot,
  filename,
  manifest,
  res
}: MetroTranformerParams) => {
  const filePath = `${projectRoot}/${filename}`;

  manifest.chunks.assets = manifest.chunks.assets || {};
  manifest.chunks.assets[filePath] = 0;

  return res;
};

export default collectAssetTransformer;
