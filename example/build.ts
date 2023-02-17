import {buildUpdate} from '@herina-rn/core';
import herinaConfig from './herina.config';

const start = async (config: any) => {
  await buildUpdate(config);
};

start(herinaConfig);
