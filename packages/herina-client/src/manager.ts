import {
  HerinaVersionsInfo,
  isArrayWithLength,
  removeArrDuplicatedItems
} from "@herina-rn/shared";
import AppCapacityInterface from "./contracts/AppCapacityInterface";
import UpdateManagerInterface from "./contracts/UpdateManagerInterface";

class UpdateManager implements UpdateManagerInterface {
  private __baseUrl: string;
  private __app: AppCapacityInterface;
  private __ignoreRelease: boolean;
  private __versionsJsonCache: HerinaVersionsInfo;
  private static __instance: UpdateManager;

  private constructor(
    baseUrl: string,
    app: AppCapacityInterface,
    ignoreRelease = false
  ) {
    this.__baseUrl = baseUrl;
    this.__app = app;
    this.__ignoreRelease = ignoreRelease;
  }

  static getInstance(
    app: AppCapacityInterface,
    baseUrl = "",
    ignoreRelease = false
  ) {
    if (!UpdateManager.__instance) {
      UpdateManager.__instance = new UpdateManager(
        baseUrl || global.baseUrl,
        app,
        ignoreRelease
      );
    }

    return UpdateManager.__instance;
  }

  async getVersionsJsonFromRemote() {
    if (this.__versionsJsonCache) {
      return this.__versionsJsonCache;
    }

    const url = `${this.__baseUrl}/versions.json`;

    const response = await fetch(url, { cache: "no-store" });
    const versions: HerinaVersionsInfo = await response.json();

    if (!versions) {
      throw new Error("versions.json from remote is empty.");
    }

    this.__versionsJsonCache = versions;

    return versions;
  }

  async getNextReleaseVersionNum() {
    const versionConfig = await this.__app.getVersionConfig();
    const info = await this.getVersionsJsonFromRemote();

    const { originalVersionNum } = versionConfig;
    const { releaseVersionNums } = info;
    const originalVersionNumIdx = releaseVersionNums.findIndex(
      (num) => num === originalVersionNum
    );
    const nextReleaseVersionIdx = originalVersionNumIdx - 1;
    const nextReleaseVersionNum = releaseVersionNums[nextReleaseVersionIdx];

    return nextReleaseVersionNum;
  }

  async getAvailableVersions() {
    const versionConfig = await this.__app.getVersionConfig();
    const info = await this.getVersionsJsonFromRemote();
    const nextReleaseNum = await this.getNextReleaseVersionNum();

    const nextReleaseVersionNum =
      this.__ignoreRelease || !nextReleaseNum
        ? info.versions[0].versionNum + 1
        : nextReleaseNum;

    const { versionNum } = versionConfig;

    const availableVersions = info.versions.filter(
      (item) =>
        item.versionNum > versionNum && item.versionNum < nextReleaseVersionNum
    );

    return availableVersions;
  }

  async checkForUpdate() {
    return isArrayWithLength(await this.getAvailableVersions());
  }

  async requestFullUpdate() {
    if (!(await this.checkForUpdate())) {
      throw new Error("No need to update.");
    }

    const versions = await this.getAvailableVersions();
    const firstVersion = versions[0];

    if (!firstVersion) throw new Error("No availble versions.");

    await this.__app.downloadBundleToUpdate(this.__baseUrl, firstVersion);

    await this.__app.setVersionConfigValues({
      nextVersionNum: firstVersion.versionNum,
      nextCommitHash: firstVersion.commitHash,
      isFullAvailable: true,
      fullToApply: firstVersion
    });

    return true;
  }

  async requestIncrementalUpdates() {
    if (!(await this.checkForUpdate())) {
      throw new Error("No need to update.");
    }

    const versions = await this.getAvailableVersions();
    const firstVersion = versions[0];

    if (!firstVersion) throw new Error("No availble versions.");

    await this.__app.downloadIncrementalUpdates(this.__baseUrl, versions);

    await this.__app.setVersionConfigValues({
      nextVersionNum: firstVersion.versionNum,
      nextCommitHash: firstVersion.commitHash,
      isIncrementalAvailable: true,
      incrementalsToApply: removeArrDuplicatedItems(
        versions.map((ver) => ver.fileNames.incremental).reverse()
      )
    });

    return true;
  }

  async requestUpdate() {
    if (!(await this.checkForUpdate())) {
      throw new Error("No need to update.");
    }

    try {
      const res = await this.requestIncrementalUpdates();

      if (!res) {
        return this.requestFullUpdate();
      }
    } catch (e) {
      return this.requestFullUpdate();
    }

    return true;
  }

  async applyUpdate(immediate: boolean) {
    const versionConfig = await this.__app.getVersionConfig();

    if (versionConfig.isIncrementalAvailable) {
      return this.applyIncrementalUpdate(immediate);
    }

    if (versionConfig.isFullAvailable) {
      return this.applyFullUpdate(immediate);
    }

    throw new Error("No update is available.");
  }

  async applyIncrementalUpdate(immediate: boolean) {
    const versionConfig = await this.__app.getVersionConfig();

    if (!versionConfig.isIncrementalAvailable) {
      throw new Error("No incremental update is available.");
    }

    await this.__app.applyIncrementalUpdate();

    await this.__app.setVersionConfigValues({
      versionNum: versionConfig.nextVersionNum,
      commitHash: versionConfig.nextCommitHash,
      nextVersionNum: 0,
      nextCommitHash: "",
      isIncrementalAvailable: false,
      incrementalsToApply: [],
      isFullAvailable: false,
      useOriginal: false,
      appliedVersionNums: (versionConfig.appliedVersionNums || []).concat(
        versionConfig.nextVersionNum
      )
    });

    if (immediate) {
      this.reloadApp();
    }

    return true;
  }

  async applyFullUpdate(immediate: boolean) {
    const versionConfig = await this.__app.getVersionConfig();

    if (!versionConfig.isFullAvailable) {
      throw new Error("No full update is available.");
    }

    await this.__app.applyFullUpdate();

    await this.__app.setVersionConfigValues({
      versionNum: versionConfig.fullToApply.versionNum,
      commitHash: versionConfig.fullToApply.commitHash,
      nextCommitHash: "",
      nextVersionNum: 0,
      useOriginal: false,
      isIncrementalAvailable: false,
      isFullAvailable: false,
      fullToApply: null,
      appliedVersionNums: (versionConfig.appliedVersionNums || []).concat(
        versionConfig.nextVersionNum
      )
    });

    if (immediate) {
      this.reloadApp();
    }

    return true;
  }

  async isFullUpdateAvailable() {
    const config = await this.__app.getVersionConfig();

    return config.isFullAvailable;
  }

  async isIncrementalUpdateAvailable() {
    const config = await this.__app.getVersionConfig();

    return config.isIncrementalAvailable;
  }

  clearCache() {
    this.__versionsJsonCache = undefined;
  }

  setUseOriginalBundle(original: boolean) {
    return this.__app.setUseOriginalBundle(original);
  }

  reloadApp() {
    this.__app.reloadApp();
  }
}

export default UpdateManager;
