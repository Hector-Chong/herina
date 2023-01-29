#!/usr/bin/env node
import buildChunksCommand from "./buildChunks";
import { version } from "../package.json";
import buildVersionsJsonCommand from "./buildVersionsJson";
import { injectBuildCommandOptions } from "./shared";

const { Command } = require("commander");

const program = new Command();

program
  .name("herina")
  .description("CLI for using Herina to split bundle.")
  .version(version);

injectBuildCommandOptions(
  program.command("build-chunks").description("Buidling chunks")
).action(buildChunksCommand);

injectBuildCommandOptions(
  program
    .command("build-incremental")
    .description("Buidling Incremental Update")
).action(buildVersionsJsonCommand);

program
  .command("build-versions-json")
  .description("Buidling versions.json")
  .argument("<projectConfig>", "Path to a Herina configuration file")
  .action(buildVersionsJsonCommand);

program.parse(process.argv);
