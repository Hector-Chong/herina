import {
  BabelTransformerArgs,
  transform as metroBabelTrasnform
} from "metro-babel-transformer";
import { File } from "@babel/types";
import changeDynamicToAbsoluteTransformer from "./changeDynamicToAbsoluteTransformer";

export type HerinaBabelTransformerAfterArgs = {
  ast: File;
} & BabelTransformerArgs;

export type HerinaBabelTransformerAfter = (
  args: HerinaBabelTransformerAfterArgs
) => {
  ast: File;
};

export type HerinaBabelTransformerBefore = (
  args: BabelTransformerArgs
) => BabelTransformerArgs;

const babelTransformer = (args: BabelTransformerArgs) => {
  const { ast } = metroBabelTrasnform({ ...args });

  const argsForHerina: HerinaBabelTransformerAfterArgs = {
    ...args,
    ast: ast as File
  };

  if (args.filename.match(/logo/)) {
    console.log(args);
  }

  changeDynamicToAbsoluteTransformer(argsForHerina);

  return { ast };
};

module.exports = {
  transform: babelTransformer
};
