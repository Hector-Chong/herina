import traverse, { Node } from "@babel/traverse";
import {
  ArrayExpression,
  identifier,
  Identifier,
  numericLiteral,
  NumericLiteral,
  ObjectProperty,
  objectProperty,
  StringLiteral
} from "@babel/types";
import { manifest } from "../builder/manifest";
import { findHerinaModuleId } from "../utils/manifest";

const assetsTransformer = (ast: Node) => {
  const assetsChunkModules = manifest.chunksReversed.assets || {};

  traverse(ast, {
    CallExpression(path) {
      const node = path.node;
      const callee = node.callee as Identifier;

      if (callee.name === "__d") {
        const fnArguments = node.arguments;
        const moduleIdNode = fnArguments[1] as NumericLiteral;
        const moduleId = moduleIdNode.value;

        if (assetsChunkModules[moduleId]) {
          const dependenciesNode = fnArguments[2] as ArrayExpression;

          (dependenciesNode.elements[0] as NumericLiteral).value =
            findHerinaModuleId(manifest);

          path.scope.traverse(node, {
            ObjectExpression(nodePath) {
              if (
                (nodePath.node.properties as ObjectProperty[]).some(
                  (prop) =>
                    (prop.key as Identifier).name === "httpServerLocation" ||
                    (prop.key as StringLiteral).value === "httpServerLocation"
                )
              ) {
                nodePath.node.properties.push(
                  objectProperty(identifier("id"), numericLiteral(moduleId))
                );
              }
            }
          });
        }
      }
    }
  });
};

export default assetsTransformer;
