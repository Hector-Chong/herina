import { resolve } from "path";

export interface BuildArgs {
  baseUrl?: string;
  root?: string;
  entryFile?: string;
  minify?: boolean;
  platform?: "ios" | "android";
  manifestPath?: string;
  projectConfig?: string;
  checkNativeChange?: boolean;
}

export const validateBuildArgs = (args: BuildArgs) => {
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

export const injectBuildCommandOptions = (command: any) => {
  return command
    .option("--base-url <url>", "Base url for dynamic chunks")
    .option("--root <root>", "Path to project root")
    .option("--entry-file <path>", "Path to the root JS file")
    .option("--output-path <path>", "Path where to store chunks")
    .option("--minify", "If true, outputs are minified")
    .option("--platform <platform>", "Building target platform. ios or android")
    .option("--manifest-path <path>", "Path to manifest.json")
    .option("--project-config <path>", "Path to a Herina configuration file")
    .option("--check-native-change", "Check the native change");
};
