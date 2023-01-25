import traverse, { Node } from "@babel/traverse";
import { idToFileMap } from "../serializer/createModuleIdFactory";
import {
  Identifier,
  NumericLiteral,
  ExpressionStatement,
  isCallExpression,
  program
} from "@babel/types";
import { CommitDifferentFile } from "../utils/git";
import { getManifestChunks } from "src/utils/file";
import { HerinaManifest } from "@herina/shared";

const incrementalTransformer = (
  manifest: HerinaManifest,
  ast: Node,
  files: CommitDifferentFile[]
) => {
  const { mainChunkReversed } = getManifestChunks(manifest);
  const statements: ExpressionStatement[] = [];

  traverse(ast, {
    ExpressionStatement(path) {
      const node = path.node;

      if (isCallExpression(node.expression)) {
        const definerNode = node.expression;

        const callee = definerNode.callee as Identifier;

        if (callee.name === "__d") {
          const fnArguments = definerNode.arguments;
          const idNode = fnArguments[1] as NumericLiteral;
          const moduleId = idNode.value;
          const absolutePath = idToFileMap.get(moduleId);

          if (
            mainChunkReversed[moduleId] &&
            files.some((file) => file.filename === absolutePath)
          ) {
            statements.push(node);
          }
        }
      }
    }
  });

  const newAst = program(statements);

  return { ast: newAst };
};

export default incrementalTransformer;
