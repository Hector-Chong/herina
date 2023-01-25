import generate from "@babel/generator";
import traverse, { Node, NodePath } from "@babel/traverse";
import { idToFileMap } from "../serializer/createModuleIdFactory";
import {
  Identifier,
  NumericLiteral,
  ArrayExpression,
  CallExpression
} from "@babel/types";
import { HerinaConfig } from "@herina-rn/shared";
import { manifest } from "../builder/buildChunks";

const bundleTransformer = (config: HerinaConfig, ast: Node) => {
  const mainChunkModules = manifest.chunks.main || {};
  const dynamicChunkModules = manifest.chunks.dynamic || {};
  const dynamicModulesGraph = new Map();
  const splitChunks = [mainChunkModules, dynamicChunkModules];

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
            if (mainChunkModules[absolutePath]) {
              mainChunkCode += code + ";";

              path.remove();
            }

            if (manifest.chunksReversed.dynamic[moduleId]) {
              dynamicModulesGraph.set(absolutePath, {
                moduleId,
                dependenciesId,
                code
              });
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

export default bundleTransformer;
