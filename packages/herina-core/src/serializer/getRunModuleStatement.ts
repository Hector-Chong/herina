import { HerinaConfig } from "@herina-rn/shared";
import { manifest } from "../builder/manifest";

const globalVariable = `var globalContext = "undefined" != typeof globalThis
? globalThis
: "undefined" != typeof global
? global
: "undefined" != typeof window
? window
: this;`;

const insertTag = `${JSON.stringify("#HERINAINSERTTAG#")};`;

const getRunModuleStatement = (config: HerinaConfig) => {
  let inserted = false;

  const globalConfig = `globalContext.baseUrl = ${JSON.stringify(
    config.baseUrl
  )};`;

  let herinaModuleId: number;

  return (moduleId: number) => {
    if (!herinaModuleId) {
      Object.keys(manifest.chunks.vendor).forEach((key) => {
        if (key.match(/@herina\-rn\/client\/src\/index/)) {
          herinaModuleId = manifest.chunks.vendor[key];
        }
      });
    }

    const insertHerinaModuleId = `globalContext.herinaModuleId = ${herinaModuleId};`;

    if (inserted) {
      return `__r(${JSON.stringify(moduleId)});`;
    } else {
      inserted = true;

      return `${globalVariable} ${globalConfig} ${insertTag} ${insertHerinaModuleId} __r(${JSON.stringify(
        moduleId
      )});`;
    }
  };
};

export default getRunModuleStatement;
