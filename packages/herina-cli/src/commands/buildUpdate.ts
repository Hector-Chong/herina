import { buildUpdate } from "@herina-rn/core";
import { BuildArgs, validateBuildArgs } from "../shared";

const buildUpdateCommand = (args: BuildArgs) => {
  const newArgs = validateBuildArgs(args);

  buildUpdate(newArgs);
};

export default buildUpdateCommand;
