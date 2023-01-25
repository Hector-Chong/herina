import { AppVersionConfig, HerinaVersionsHistoryItem } from "@herina-rn/shared";
import AppCapacityInterface from "./contracts/AppCapacityInterface";
import { promisifyNativeFunction } from "./utils/fn";

class AppCapacityImplements implements AppCapacityInterface {
  private __nativeModule: any;

  constructor(nativeModule: any) {
    this.__nativeModule = nativeModule;
  }

  initVersionJson(config: AppVersionConfig) {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.initVersionJson
    )(config);
  }

  async getVersionConfig() {
    const versionFromNative = await promisifyNativeFunction<
      AppVersionConfig | undefined
    >(this.__nativeModule.getVersionConfig)();

    if (!versionFromNative) {
      const versionFromLocal: AppVersionConfig = require("./assets/version.json");

      await this.initVersionJson(versionFromLocal);

      this.setVersionConfigValues({
        versionNum: versionFromLocal.versionNum,
        commitHash: versionFromLocal.commitHash
      });

      return versionFromLocal;
    } else {
      return versionFromNative;
    }
  }

  downloadIncrementalUpdates(
    baseUrl: string,
    versions: HerinaVersionsHistoryItem[]
  ) {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.downloadIncrementalUpdates
    )({ baseUrl, versions });
  }

  downloadBundleToUpdate(baseUrl: string) {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.downloadBundleToUpdate
    )({ baseUrl });
  }

  setVersionConfigValues(params: Partial<AppVersionConfig>) {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.setVersionConfigValues
    )(params);
  }

  setUseOriginalBundle(original: boolean) {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.setUseOriginalBundle
    )({ original: +original });
  }

  applyIncrementalUpdate() {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.applyIncrementalUpdate
    )();
  }

  applyBundleUpdate() {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.applyBundleUpdate
    )();
  }

  reloadApp() {
    return this.__nativeModule.reloadApp();
  }
}

export default AppCapacityImplements;
