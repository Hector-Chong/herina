import {
  AppVersionConfig,
  HerinaVersionsInfo,
  HerinaVersionsItem
} from "@herina-rn/shared";

interface AppCapacityInterface {
  getVersionConfig(): Promise<AppVersionConfig>;

  downloadIncrementalUpdates(
    baseUrl: string,
    versions: HerinaVersionsItem[]
  ): Promise<boolean>;

  downloadBundleToUpdate(
    baseUrl: string,
    version: HerinaVersionsItem
  ): Promise<boolean>;

  setVersionConfigValues(params: Partial<AppVersionConfig>): Promise<boolean>;

  applyFullUpdate(): Promise<boolean>;

  applyIncrementalUpdate(): Promise<boolean>;

  setUseOriginalBundle(original: boolean): Promise<boolean>;

  reloadApp(): void;

  initVersionJson(config: AppVersionConfig): Promise<boolean>;

  getVersionsJsonFromRemote(url: string): Promise<HerinaVersionsInfo>;
}

export default AppCapacityInterface;
