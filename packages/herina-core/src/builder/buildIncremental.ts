import path from "path";
import {
  ensureDirSync,
  readFileSync,
  removeSync,
  writeFileSync
} from "fs-extra";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import { checkNativeChange, prepareToBuild } from "./prerequisite";
import buildBundle from "./buildBundle";
import incrementalTransformer from "../bundleTransformer/incrementalTransformer";
import {
  CommitDifferentFile,
  computeDifferentFiles,
  getPrevAndCurCommitHashes,
  isGitRepository
} from "../utils/git";
import { manifest } from "./manifest";
import {
  addAssetsToVersionsJson,
  addVersionHistory,
  createIncrementalFileNameViaCommitHashes,
  createVersiosnJsonIfNotExist,
  getVersionsJsonPath
} from "../utils/version";
import { HerinaConfig } from "@herina-rn/shared";

const clearResult = (config: HerinaConfig) =>
  removeSync(path.join(config.outputPath, "bundle.js"));

const filterFiles = (config: HerinaConfig, files: CommitDifferentFile[]) => {
  const filtered = files.filter((file) =>
    config.extensions!.some((ext) => file.filename.endsWith("." + ext))
  );

  return filtered.map((file) => {
    file.filename = path.join(config.root, file.filename);

    return file;
  });
};

const buildIncremental = async (config: HerinaConfig) => {
  config = prepareToBuild(config);

  const dir = config.root;
  const incrementalPath = path.resolve(config.outputPath, "incremental");

  ensureDirSync(incrementalPath);

  config.outputPath = incrementalPath;

  if (!isGitRepository(config.root))
    throw new Error(`${config.root} is not a Git repository.`);

  let { previousCommitHash, currentCommitHash } =
    await getPrevAndCurCommitHashes(config);

  if (!previousCommitHash)
    throw new Error(`Cannot find previoud commit<${previousCommitHash}>`);

  if (!currentCommitHash)
    throw new Error(`Cannot find current commit<${currentCommitHash}>`);

  const differentFiles = await computeDifferentFiles(
    dir,
    previousCommitHash,
    currentCommitHash
  );

  const incrementalFiles = filterFiles(config, differentFiles);

  const bundlePath = await buildBundle(config);
  const bundleStream = readFileSync(bundlePath);

  const originalAst = parse(bundleStream.toString());

  const { ast } = incrementalTransformer(
    manifest,
    originalAst,
    incrementalFiles
  );

  const { code } = generate(ast);

  clearResult(config);

  if (config.incremental && config.incremental.pure === true) {
    const incrementalFilePath = config.incremental.filePath;

    if (!incrementalFilePath) {
      throw new Error(
        "`incremental.filePath` is required when `incremental.pure` is true."
      );
    }

    writeFileSync(incrementalFilePath, code);

    return incrementalFilePath;
  } else {
    config.outputPath = path.resolve(incrementalPath, "..");

    const versions = createVersiosnJsonIfNotExist(config);
    addVersionHistory(config, versions, currentCommitHash, previousCommitHash);
    addAssetsToVersionsJson(versions);

    const incrementalFileName = createIncrementalFileNameViaCommitHashes(
      currentCommitHash,
      previousCommitHash
    );

    versions.history[0].filePath = incrementalFileName;

    if (incrementalFileName) {
      writeFileSync(getVersionsJsonPath(config), JSON.stringify(versions));
    }

    const filePath = path.join(incrementalPath, incrementalFileName);

    checkNativeChange(config);

    writeFileSync(filePath, code);

    return filePath;
  }
};

export default buildIncremental;
