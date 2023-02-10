import generate from "@babel/generator";
import traverse, { Node } from "@babel/traverse";
import { idToFileMap } from "../serializer/createModuleIdFactory";
import { Identifier, NumericLiteral, ArrayExpression } from "@babel/types";
import { HerinaConfig } from "@herina-rn/shared";
import { manifest } from "../builder/manifest";
import { filterFile } from "../builder/buildUpdate";
import { INCREMENTAL_INSERT_TAG } from "../consts";

const fullTransformer = (config: HerinaConfig, ast: Node) => {
  const mainChunkModules = manifest.chunks.main || {};
  const assetsChunkModules = manifest.chunks.assets || {};
  const dynamicChunkModules = manifest.chunks.dynamic || {};
  const dynamicModulesGraph = new Map();
  const splitChunks = [
    mainChunkModules,
    assetsChunkModules,
    dynamicChunkModules
  ];

  let mainChunkCode = "";

  const shouldSplit = (absolutePath: string) =>
    splitChunks.some((chunk) => chunk[absolutePath]);

  traverse(ast, {
    CallExpression(path) {
      const node = path.node;
      const callee = node.callee as Identifier;
      const calleeToSplit = ["__d", "__r"];

      if (calleeToSplit.some((v) => callee.name === v)) {
        const { code } = generate(node);

        if (callee.name === "__d") {
          const fnArguments = node.arguments;
          const idNode = fnArguments[1] as NumericLiteral;
          const dependenciesNode = fnArguments[2] as ArrayExpression;
          const moduleId = idNode.value;
          const absolutePath = idToFileMap.get(moduleId);

          const dependenciesId = [
            ...new Set(
              (dependenciesNode.elements as NumericLiteral[]).map(
                (elm) => elm.value
              )
            )
          ];

          if (shouldSplit(absolutePath) && filterFile(config, absolutePath)) {
            if (
              mainChunkModules[absolutePath] ||
              assetsChunkModules[absolutePath]
            ) {
              mainChunkCode += code + ";";

              path.remove();
            }

            manifest.chunksReversed.dynamic =
              manifest.chunksReversed.dynamic || {};

            if (manifest.chunksReversed.dynamic[moduleId]) {
              dynamicModulesGraph.set(absolutePath, {
                moduleId,
                dependenciesId,
                code
              });

              path.remove();
            }
          }
        }

        if (callee.name === "__r") {
          mainChunkCode += code + ";";

          path.remove();
        }
      }
    },
    StringLiteral(path) {
      const node = path.node;

      if (node.value === INCREMENTAL_INSERT_TAG) {
        path.remove();
      }
    }
  });

  mainChunkCode += JSON.stringify(INCREMENTAL_INSERT_TAG);

  return { ast, dynamicModulesGraph, mainChunkCode };
};

export default fullTransformer;
