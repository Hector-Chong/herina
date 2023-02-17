const {createMetroConfig, isAppBuilding} = require('@herina-rn/core');
const herinaConfig = require('./herina.config');

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = (_, isBuilding) => {
  isBuilding = typeof isBuilding === 'undefined' ? isAppBuilding() : isBuilding;

  return isBuilding ? createMetroConfig(herinaConfig, config, true) : config;
};
