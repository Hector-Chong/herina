import { build } from "@herina-rn/core";
import { BuildArgs, validateBuildArgs } from "./shared";

const buildFullCommand = (args: BuildArgs) => {
  const newArgs = validateBuildArgs(args);

  build(newArgs);
};

export default buildFullCommand;
