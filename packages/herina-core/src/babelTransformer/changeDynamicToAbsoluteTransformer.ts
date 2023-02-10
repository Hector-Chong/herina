import fs from "fs-extra";
import traverse from "@babel/traverse";
import { isArrayWithLength } from "@herina-rn/shared";
import { getParsedConfig } from "../utils/file";
import { resolve } from "path";
import { HerinaBabelTransformerAfter } from ".";

const changeDynamicToAbsoluteTransformer: HerinaBabelTransformerAfter = ({
  ast
}) => {
  const config = getParsedConfig();

  traverse(ast, {
    CallExpression(path) {
      const node = path.node;
      const callee = node.callee;

      if (callee.type === "Import") {
        const fnArguments = node.arguments;
        const firstArgument = fnArguments[0];

        if (firstArgument.type === "StringLiteral") {
          const value = resolve(config.root!, "src", firstArgument.value);
          let filePath = value;

          if (!fs.existsSync(filePath)) {
            if (isArrayWithLength(config.extensions)) {
              config.extensions!.forEach((extension: string) => {
                const filePathWithExtension = `${filePath}.${extension}`;

                if (fs.existsSync(filePathWithExtension)) {
                  filePath = filePathWithExtension;
                }
              });
            }

            if (filePath === value) {
              throw new Error(`${filePath} does not exist`);
            }
          }

          firstArgument.value = filePath;
        }
      }
    }
  });

  return { ast };
};

export default changeDynamicToAbsoluteTransformer;
