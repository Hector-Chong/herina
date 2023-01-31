import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse, { Node } from "@babel/traverse";
import { ObjectProperty, StringLiteral } from "@babel/types";
import { isGitRepository } from "../utils/git";
import { MetroTranformerParams } from "../metroTransformer";
import { getPrevAndCurCommitHashes } from "src/builder/buildIncremental";

const appVersionConfigTransformer = async ({
  herinaConfig,
  projectRoot,
  filename,
  res
}: MetroTranformerParams) => {
  const filePath = `${projectRoot}/${filename}`;

  if (filePath.match(/@herina\-rn\/client\/src\/assets\/version.json/)) {
    if (!isGitRepository(herinaConfig.root)) {
      return;
    }

    const { currentCommitHash } = await getPrevAndCurCommitHashes(herinaConfig);

    const { output: resOutput } = res;

    (resOutput || []).forEach((output) => {
      const code = output.data.code;

      if (code) {
        const ast = parse(code);

        injectVersionConfigWithAST(currentCommitHash, ast);

        output.data.code = generate(ast).code;
      }
    });
  }

  return res;
};

const injectVersionConfigWithAST = (currentCommitHash: string, ast: Node) => {
  traverse(ast, {
    ObjectExpression(path) {
      const { properties } = path.node;

      const data = {
        versionNum: 1,
        commitHash: currentCommitHash,
        originalVersionNum: 1,
        originalCommitHash: currentCommitHash
      };

      const dataKeys = new Set(Object.keys(data));

      (properties as ObjectProperty[]).forEach((property) => {
        const propKey = property.key;

        if (propKey.type === "StringLiteral" && dataKeys.has(propKey.value)) {
          const propValue = property.value as StringLiteral;

          propValue.value = data[propKey.value];
        }
      });
    }
  });
};

export default appVersionConfigTransformer;
