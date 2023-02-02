import { HerinaConfig } from "@herina-rn/shared";
import { manifest } from "../builder/manifest";
import { isArrayWithLength } from "../utils/arr";
import { getVersionsJson } from "../utils/version";

const globalVariable = `var globalContext = "undefined" != typeof globalThis
? globalThis
: "undefined" != typeof global
? global
: "undefined" != typeof window
? window
: this;`;

const insertTag = `${JSON.stringify("#HERINAINSERTTAG#")};`;

const getBaseUrl = (config: HerinaConfig) => {
  if (typeof config.baseUrl === "string") {
    return config.baseUrl;
  } else {
    return config.baseUrl[config.platform];
  }
};

const getReleaseVersionNumber = (config: HerinaConfig) => {
  const info = getVersionsJson(config);

  if (info && isArrayWithLength(info.versions)) {
    return info.versions[0].versionNum + 1;
  } else {
    return 1;
  }
};

const getRunModuleStatement = (config: HerinaConfig) => {
  let inserted = false;

  const globalConfig = `globalContext.baseUrl = ${JSON.stringify(
    getBaseUrl(config)
  )}; globalContext.releaseVersionNums = ${getReleaseVersionNumber(config)};`;

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
