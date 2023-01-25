import traverse, { Node } from "@babel/traverse";
import generate from "@babel/generator";
import { parse } from "@babel/parser";
import { Identifier, isCallExpression, StringLiteral } from "@babel/types";
import { getChunkHashedName } from "../utils/file";
import { MetroTranformerParams } from ".";

const changeDynamicNameTransformer = ({
  projectRoot,
  filename,
  res
}: MetroTranformerParams) => {
  const filePath = `${projectRoot}/${filename}`;

  if (!filePath.match(/node_modules/)) {
    const { output: resOutput } = res;

    (resOutput || []).forEach((output) => {
      const code = output.data.code;

      if (code) {
        const ast = parse(code);

        changeDynamicNameWithAST(ast);

        output.data.code = generate(ast).code;
      }
    });
  }

  return res;
};

const changeDynamicNameWithAST = (ast: Node) => {
  traverse(ast, {
    CallExpression(path) {
      const node = path.node;

      if (isCallExpression(node.callee)) {
        const callee = node.callee.callee as Identifier;

        if (
          (callee.name === "_$$_REQUIRE" || callee.name === "r") &&
          node.arguments[1]
        ) {
          const secondArgument = node.arguments[1] as StringLiteral;

          secondArgument.value = getChunkHashedName(
            secondArgument.value,
            "dynamic"
          );
        }
      }
    }
  });
};

export default changeDynamicNameTransformer;
