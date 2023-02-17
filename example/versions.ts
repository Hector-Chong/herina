import {buildVersionsJson, HerinaConfig} from '@herina-rn/core';
import herinaConfig from './herina.config';

const start = async (config: HerinaConfig) => {
  await buildVersionsJson(config);
};

start(herinaConfig);
