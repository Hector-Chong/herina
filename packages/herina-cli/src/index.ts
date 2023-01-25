#!/usr/bin/env node
import build from "./build";
import { version } from "../package.json";

const { Command } = require("commander");

const program = new Command();

program
  .name("herina")
  .description("CLI to use Herina to split code.")
  .version(version);

program
  .command("build")
  .description("Buidling chunks")
  .option("--base-url <url>", "Base url for dynamic chunks")
  .option("--root <root>", "Path to project root")
  .option("--entry-file <path>", "Path to the root JS file")
  .option("--output-path <path>", "Path where to store chunks")
  .option("--minify", "If true, outputs are minified")
  .option("--platform <platform>", "Building target platform. ios or android")
  .option("--manifest-path <path>", "Path to manifest.json")
  .option("--project-config <path>", "Path to a Herina configuration file")
  .action(build);

program.parse(process.argv);
