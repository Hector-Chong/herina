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
import { filterFile } from "./buildUpdate";

const getFilesToTransform = (
  config: HerinaConfig,
  files: CommitDifferentFile[]
) => {
  return files
    .map((file) => {
      file.filename = path.join(config.root, file.filename);

      return file;
    })
    .filter((file) => filterFile(config, file.filename));
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

  const incrementalFiles = getFilesToTransform(config, differentFiles);

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
