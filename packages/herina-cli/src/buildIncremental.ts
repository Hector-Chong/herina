import { buildIncremental } from "@herina-rn/core";
import { BuildArgs, validateBuildArgs } from "./shared";

const buildIncrementalCommand = (args: BuildArgs) => {
  const newArgs = validateBuildArgs(args);

  buildIncremental(newArgs);
};

export default buildIncrementalCommand;
