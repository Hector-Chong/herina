import traverse from "@babel/traverse";
import { Identifier, Node, NumericLiteral } from "@babel/types";
import { manifest } from "../builder/buildChunks";

const removeDynamicFromBundleTransformer = (ast: Node) => {
  traverse(ast, {
    CallExpression(path) {
      const node = path.node;
      const callee = node.callee as Identifier;

      if (callee.name === "__d") {
        const fnArguments = node.arguments;
        const idNode = fnArguments[1] as NumericLiteral;
        const moduleId = idNode.value;

        if (manifest.chunksReversed.dynamic[moduleId]) {
          path.remove();
        }
      }
    }
  });
};

export default removeDynamicFromBundleTransformer;
