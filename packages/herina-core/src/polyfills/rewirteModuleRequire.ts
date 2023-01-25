declare var __r: (moduleId: number) => any;

const requireReference = __r;

__r = (moduleId) => {
  if (moduleId === 1) {
    const emergencyRestoreBundleToOriginal = () => {
      const manager = requireReference(
        global.herinaModuleId
      ).registerUpdateManager();

      manager.setUseOriginalBundle(true).then(() => {
        manager.reloadApp();
      });
    };

    const originalHandler = global.ErrorUtils.getGlobalHandler();

    global.ErrorUtils.setGlobalHandler(emergencyRestoreBundleToOriginal);

    const res = requireReference(moduleId);

    global.ErrorUtils.setGlobalHandler(originalHandler);

    return res;
  } else {
    return requireReference(moduleId);
  }
};
