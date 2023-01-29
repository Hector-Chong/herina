import { buildVersionsJson } from "@herina-rn/core";
import { existsSync } from "fs";
import { resolve } from "path";

const buildVersionsJsonCommand = (projectConfig: string) => {
  const configPath = resolve(process.cwd(), projectConfig);

  if (!existsSync(configPath)) {
    throw new Error(`${configPath} does not exist.`);
  }

  const config = require(resolve(process.cwd(), projectConfig));

  buildVersionsJson(config);
};

export default buildVersionsJsonCommand;
