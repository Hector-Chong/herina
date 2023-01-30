import path from "path";
import fs, {
  ensureDirSync,
  readFileSync,
  removeSync,
  writeFileSync
} from "fs-extra";
import git from "isomorphic-git";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import { prepareToBuild } from "./prerequisite";
import buildBundle from "./buildBundle";
import incrementalTransformer from "../bundleTransformer/incrementalTransformer";
import {
  CommitDifferentFile,
  computeDifferentFiles,
  isGitRepository
} from "../utils/git";
import { manifest } from "./manifest";
import {
  addVersionHistory,
  createVersiosnJsonIfNotExist,
  getVersionsJsonPath
} from "../utils/version";
import { HerinaConfig } from "@herina-rn/shared";

const clearResult = (config: HerinaConfig) => {
  removeSync(path.join(config.outputPath, "bundle.js"));
};

export const getPrevAndCurCommitHashes = async (config: HerinaConfig) => {
  const dir = config.root;

  let { previousCommitHash, currentCommitHash } = config.incremental || {};

  const commits = await git.log({
    fs,
    dir
  });

  if (!previousCommitHash) {
    previousCommitHash = commits[1].oid;
  }

  if (!currentCommitHash) {
    currentCommitHash = commits[0].oid;
  }

  return { previousCommitHash, currentCommitHash };
};

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
    const incrementalFileName = addVersionHistory(
      currentCommitHash,
      previousCommitHash,
      versions
    );

    if (incrementalFileName) {
      writeFileSync(getVersionsJsonPath(config), JSON.stringify(versions));
    }

    const filePath = path.join(incrementalPath, incrementalFileName);

    writeFileSync(filePath, code);

    return filePath;
  }
};

export default buildIncremental;
