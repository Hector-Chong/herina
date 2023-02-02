import generate from "@babel/generator";
import traverse, { Node } from "@babel/traverse";
import { idToFileMap } from "../serializer/createModuleIdFactory";
import { Identifier, NumericLiteral, ArrayExpression } from "@babel/types";
import { HerinaConfig } from "@herina-rn/shared";
import { manifest } from "../builder/manifest";

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

          if (
            shouldSplit(absolutePath) &&
            config.extensions!.some((e) => absolutePath.endsWith(e))
          ) {
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
    }
  });

  return { ast, dynamicModulesGraph, mainChunkCode };
};

export default fullTransformer;