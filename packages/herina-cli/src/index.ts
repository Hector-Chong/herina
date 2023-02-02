#!/usr/bin/env node
import buildFullCommand from "./buildFull";
import buildIncrementalCommand from "./buildIncremental";
import { version } from "../package.json";
import { injectBuildCommandOptions } from "./shared";

const { Command } = require("commander");

const program = new Command();

program
  .name("herina")
  .description("CLI for using Herina to split bundle.")
  .version(version);

injectBuildCommandOptions(
  program.command("build-chunks").description("Buidling chunks")
).action(buildFullCommand);

injectBuildCommandOptions(
  program
    .command("build-incremental")
    .description("Buidling Incremental Update")
).action(buildIncrementalCommand);

program.parse(process.argv);
