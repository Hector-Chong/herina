const {HerinaUpdateType} = require('@herina-rn/core');

/**
 * @type {import('@herina-rn/core').HerinaConfig}
 */
module.exports = {
  environment: 'production',
  baseUrl: 'https://hector.im',
  root: '/Users/hectorchong/Project/ReactNativeNewArch70',
  entryFile: '/Users/hectorchong/Project/ReactNativeNewArch70/index.js',
  outputPath: '/Users/hectorchong/Project/ReactNativeNewArch70/dist',
  minify: false,
  platform: 'android',
  manifestPath: '/Users/hectorchong/Project/ReactNativeNewArch70/manifest.json',
  updateType: HerinaUpdateType.FULL,
};
