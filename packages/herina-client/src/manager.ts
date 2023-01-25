import { HerinaVersions } from "@herina-rn/shared";
import AppCapacityInterface from "./contracts/AppCapacityInterface";
import UpdateManagerInterface from "./contracts/UpdateManagerInterface";

class UpdateManager implements UpdateManagerInterface {
  private __baseUrl: string;
  private __app: AppCapacityInterface;
  private __versionsCache: HerinaVersions;
  private static __instance: UpdateManager;

  private constructor(baseUrl: string, app: AppCapacityInterface) {
    this.__baseUrl = baseUrl;
    this.__app = app;
  }

  static getInstance(app: AppCapacityInterface, baseUrl = "") {
    if (!UpdateManager.__instance) {
      UpdateManager.__instance = new UpdateManager(
        baseUrl || global.baseUrl,
        app
      );
    }

    return UpdateManager.__instance;
  }

  async getVersionsFromRemote() {
    if (this.__versionsCache) {
      return this.__versionsCache;
    }

    const url = `${this.__baseUrl}/versions.json`;

    const response = await fetch(url, { cache: "no-store" });
    const versions: HerinaVersions = await response.json();

    if (!versions) {
      throw new Error("versions.json from remote is empty.");
    }

    this.__versionsCache = versions;

    return versions;
  }

  async checkForUpdate() {
    const versionConfig = await this.__app.getCurrentVersion();
    const versionsFromRemote = await this.getVersionsFromRemote();

    return versionConfig.versionNum < versionsFromRemote.currentVersionNum;
  }

  async requestBundleUpdate() {
    if (!(await this.checkForUpdate())) {
      throw new Error("No need to update.");
    }

    await this.__app.downloadBundleToUpdate(this.__baseUrl);

    const versions = await this.getVersionsFromRemote();

    await this.__app.recordNewestVersion(
      versions.currentVersionNum,
      versions.currentCommitHash
    );

    return true;
  }

  async requestIncrementalUpdates() {
    const { versionNum } = await this.__app.getCurrentVersion();
    const { currentVersionNum, currentCommitHash, history } =
      await this.getVersionsFromRemote();

    if (!(await this.checkForUpdate())) {
      throw new Error("No need to update.");
    }

    const newerVersions = history.filter(
      (item) => item.versionNum >= versionNum
    );

    if (!newerVersions.length) {
      throw new Error("No newer versions found.");
    }

    await this.__app.downloadIncrementalUpdates(this.__baseUrl, newerVersions);

    await this.__app.recordNewestVersion(currentVersionNum, currentCommitHash);

    return true;
  }

  async applyIncrementalUpdate(immediate: boolean) {
    await this.__app.applyIncrementalUpdate(immediate);

    if (immediate) {
      this.reloadApp();
    }

    return true;
  }

  async applyBundleUpdate(immediate: boolean) {
    await this.__app.applyBundleUpdate(immediate);

    if (immediate) {
      this.reloadApp();
    }

    return true;
  }

  async isBundleUpdateAvailable() {
    return true;
  }

  async isIncrementalUpdateAvailable() {
    return true;
  }

  clearCache() {
    this.__versionsCache = undefined;
  }

  setUseOriginalBundle(original: boolean) {
    return this.__app.setUseOriginalBundle(original);
  }

  reloadApp() {
    return this.__app.reloadApp();
  }
}

export default UpdateManager;
