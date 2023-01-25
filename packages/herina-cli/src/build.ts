const process = require("process");
const { resolve } = require("path");

import { build } from "herina";

interface BuildArgs {
  baseUrl?: string;
  root?: string;
  entryFile?: string;
  minify?: boolean;
  platform?: "ios" | "android";
  manifestPath?: string;
  projectConfig?: string;
}

const validateArgs = (args: BuildArgs) => {
  const useProjetConfig = !!args.projectConfig;

  const requiredKeys: (keyof BuildArgs)[] = [
    "baseUrl",
    "entryFile",
    "root",
    "platform"
  ];
  const partialKeys: (keyof BuildArgs)[] = ["minify", "manifestPath"];

  if (useProjetConfig) {
    const config = require(resolve(process.cwd(), args.projectConfig));

    requiredKeys.concat(partialKeys).forEach((key) => {
      const value = args[key];

      if (value) {
        config[key] = value;
      }
    });

    return config;
  } else {
    requiredKeys.forEach((key) => {
      if (!args[key]) throw new Error(`${key} is required.`);
    });

    return args;
  }
};

const buildCommand = (args: BuildArgs) => {
  const newArgs = validateArgs(args);

  build(newArgs);
};

export default buildCommand;
