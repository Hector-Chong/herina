import fs, { pathExistsSync } from "fs-extra";
import git, { walk } from "isomorphic-git";
import path from "path";

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

      const aMode = await A?.mode();

      const data: CommitDifferentFile = {
        filename,
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

      if (data.type === "same" || aMode !== 33188) {
        return;
      }

      return data;
    }
  });
};

export const isGitRepository = (rootPath: string) => {
  const plainGitPath = path.join(rootPath, ".git");

  return pathExistsSync(plainGitPath);
};
