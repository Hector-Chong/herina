import { HerinaConfig } from "@herina-rn/shared";
import fs, { existsSync, pathExistsSync } from "fs-extra";
import git, { walk } from "isomorphic-git";
import path, { resolve } from "path";

export interface CommitDifferentFile {
  filename: string;
  type: "same" | "deleted" | "added" | "modified";
}

export const computeDifferentFiles = async (
  dir: string,
  oldCommitHash: string,
  newCommitHash: string
): Promise<CommitDifferentFile[] | undefined> => {
  return walk({
    fs,
    dir,
    trees: [git.TREE({ ref: oldCommitHash }), git.TREE({ ref: newCommitHash })],
    map: async (filename, [A, B]) => {
      if (filename === ".") {
        return;
      }

      const aOid = await A?.oid();
      const bOid = await B?.oid();

      const data: CommitDifferentFile = {
        filename: filename,
        type: "same"
      };

      if (!aOid) {
        data.type = "added";
      }

      if (!bOid) {
        data.type = "deleted";
      }

      if (aOid && bOid && aOid !== bOid) {
        data.type = "modified";
      }

      if (data.type === "same") {
        return;
      }

      const fullPath = resolve(dir, filename);

      if (existsSync(fullPath)) {
        const file = await fs.lstat(fullPath);

        if (file.isDirectory()) return;
      }

      return data;
    }
  });
};

export const isGitRepository = (rootPath: string) => {
  const plainGitPath = path.join(rootPath, ".git");

  return pathExistsSync(plainGitPath);
};

export const getPrevAndCurCommitHashes = async (config: HerinaConfig) => {
  const dir = config.root;

  let { previousCommitHash, currentCommitHash } = config || {};

  const commits = await git.log({
    fs,
    dir
  });

  if (!previousCommitHash) {
    if (!commits[1])
      throw new Error(
        "This is probably a new Git repository because of no previous commit found. You should commit again before building update."
      );

    previousCommitHash = commits[1].oid;
  }

  if (!currentCommitHash) {
    currentCommitHash = commits[0].oid;
  }

  return { previousCommitHash, currentCommitHash };
};

export const getCurrentCommitHash = async (config: HerinaConfig) => {
  const dir = config.root;

  const commits = await git.log({
    fs,
    dir
  });

  return commits[0]?.oid;
};
