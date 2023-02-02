import path from "path";
import { ensureDirSync } from "fs-extra";
import generate from "@babel/generator";
import { checkNativeChange } from "./prerequisite";
import incrementalTransformer from "../bundleTransformer/incrementalTransformer";
import { CommitDifferentFile, computeDifferentFiles } from "../utils/git";
import { manifest } from "./manifest";
import { createIncrementalFileNameViaCommitHashes } from "../utils/version";
import { HerinaConfig } from "@herina-rn/shared";
import { HerinaUpdateBuiilder } from ".";

const filterFiles = (config: HerinaConfig, files: CommitDifferentFile[]) => {
  const filtered = files.filter(
    (file) =>
      config.extensions!.some((ext) => file.filename.endsWith("." + ext)) ||
      Object.keys(manifest.chunks.assets).some((filePath) =>
        filePath.match(file.filename)
      )
  );

  return filtered.map((file) => {
    file.filename = path.join(config.root, file.filename);

    return file;
  });
};

const buildIncremental: HerinaUpdateBuiilder = async (
  config,
  _,
  _bundlePath,
  currentCommitHash,
  previousCommitHash,
  originalAst
) => {
  const dir = config.root;
  const incrementalPath = path.resolve(config.outputPath, "incremental");

  ensureDirSync(incrementalPath);

  const differentFiles = await computeDifferentFiles(
    dir,
    previousCommitHash,
    currentCommitHash
  );

  const incrementalFiles = filterFiles(config, differentFiles);

  const { ast } = incrementalTransformer(
    manifest,
    originalAst,
    incrementalFiles
  );

  const { code } = generate(ast);

  const incrementalFileName = createIncrementalFileNameViaCommitHashes(
    currentCommitHash,
    previousCommitHash
  );

  const filePath = path.join(incrementalPath, incrementalFileName);

  checkNativeChange(config);

  return {
    incremental: [{ code, filename: incrementalFileName, path: filePath }]
  };
};

export default buildIncremental;
