import {buildIncremental} from '@herina-rn/core';
import config from './herina.config';

const start = async () => {
  buildIncremental(config);
};

start();
