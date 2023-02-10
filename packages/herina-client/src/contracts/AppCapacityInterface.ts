import { AppVersionConfig, HerinaVersionsItem } from "@herina-rn/shared";

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
}

export default AppCapacityInterface;
