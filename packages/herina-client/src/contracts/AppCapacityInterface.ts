import { AppVersionConfig, HerinaVersionsHistoryItem } from "@herina-rn/shared";

interface AppCapacityInterface {
  getCurrentVersion(): Promise<AppVersionConfig>;

  downloadIncrementalUpdates(
    baseUrl: string,
    versions: HerinaVersionsHistoryItem[]
  ): Promise<boolean>;

  recordNewestVersion(versionNum: number, commitHash: string): Promise<boolean>;

  applyBundleUpdate(immediate: boolean): Promise<boolean>;

  applyIncrementalUpdate(immediate: boolean): Promise<boolean>;

  downloadBundleToUpdate(baseUrl: string): Promise<boolean>;

  setUseOriginalBundle(original: boolean);

  reloadApp();

  initVersionJson(config: AppVersionConfig): Promise<boolean>;
}

export default AppCapacityInterface;
