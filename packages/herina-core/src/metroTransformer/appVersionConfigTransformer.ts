import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse, { Node } from "@babel/traverse";
import { ObjectProperty, StringLiteral } from "@babel/types";
import { getPrevAndCurCommitHashes, isGitRepository } from "../utils/git";
import { MetroTranformerParams } from "../metroTransformer";
import { getParsedConfig } from "../utils/file";
import { getVersionsJson } from "../utils/version";

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
  const config = getParsedConfig();
  const info = getVersionsJson(config);
  const versionNum = info ? info.versions[0].versionNum + 1 : 1;

  traverse(ast, {
    ObjectExpression(path) {
      const { properties } = path.node;

      const data = {
        versionNum,
        commitHash: currentCommitHash,
        originalVersionNum: versionNum,
        originalCommitHash: currentCommitHash
      };

      const dataKeys = new Set(Object.keys(data));

      (properties as ObjectProperty[]).forEach((property) => {
        const propKey = property.key;
        const propValue = property.value as StringLiteral;

        if (propKey.type === "StringLiteral" && dataKeys.has(propKey.value)) {
          propValue.value = data[propKey.value];
        }

        if (propKey.type === "Identifier" && dataKeys.has(propKey.name)) {
          propValue.value = data[propKey.name];
        }
      });
    }
  });
};

export default appVersionConfigTransformer;
