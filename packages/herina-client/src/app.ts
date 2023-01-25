import { AppVersionConfig, HerinaVersionsHistoryItem } from "@herina/shared";
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

  async getCurrentVersion() {
    const versionFromNative = await promisifyNativeFunction<
      AppVersionConfig | undefined
    >(this.__nativeModule.getCurrentVersion)();

    if (!versionFromNative) {
      const versionFromLocal: AppVersionConfig = require("./assets/version.json");

      await this.initVersionJson(versionFromLocal);

      this.recordNewestVersion(
        versionFromLocal.versionNum,
        versionFromLocal.commitHash
      );

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

  recordNewestVersion(versionNum: number, commitHash: string) {
    return promisifyNativeFunction<boolean>(
      this.__nativeModule.recordNewestVersion
    )({ versionNum, commitHash });
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
