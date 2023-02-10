#!/usr/bin/env node
import { version } from "../package.json";
import buildUpdateCommand from "./commands/buildUpdate";
import { injectBuildCommandOptions } from "./shared";

const { Command } = require("commander");

const program = new Command();

program
  .name("herina")
  .description("CLI for using Herina to build update.")
  .version(version);

injectBuildCommandOptions(
  program.command("build").description("Buidling Update")
).action(buildUpdateCommand);

program.parse(process.argv);
