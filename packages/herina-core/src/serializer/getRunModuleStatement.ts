import { HerinaConfig } from "@herina-rn/shared";
import { manifest } from "../builder/manifest";
import { INCREMENTAL_INSERT_TAG } from "../consts";
import { findHerinaModuleId } from "../utils/manifest";

const globalVariable = `var globalContext = "undefined" != typeof globalThis
? globalThis
: "undefined" != typeof global
? global
: "undefined" != typeof window
? window
: this;`;

const insertTag = `${JSON.stringify(INCREMENTAL_INSERT_TAG)};`;

const getRunModuleStatement = (config: HerinaConfig) => {
  let inserted = false;

  const globalConfig = `globalContext.baseUrl = ${JSON.stringify(
    config.baseUrl
  )};`;

  let herinaModuleId: number;

  return (moduleId: number) => {
    if (!herinaModuleId) {
      herinaModuleId = findHerinaModuleId(manifest);
    }

    const insertHerinaModuleId = `globalContext.herinaModuleId = ${herinaModuleId};`;

    if (inserted) {
      return `__r(${JSON.stringify(moduleId)});`;
    } else {
      inserted = true;

      return `${globalVariable} ${globalConfig} ${insertHerinaModuleId} ${insertTag} __r(${JSON.stringify(
        moduleId
      )});`;
    }
  };
};

export default getRunModuleStatement;
