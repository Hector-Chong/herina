import { HerinaVersions } from "@herina/shared";

interface UpdateManagerInterface {
  getVersionsFromRemote(): Promise<HerinaVersions>;

  checkForUpdate(): Promise<boolean>;

  requestBundleUpdate(): Promise<boolean>;

  requestIncrementalUpdates(): Promise<boolean>;

  applyBundleUpdate(immediate: boolean): Promise<boolean>;

  applyIncrementalUpdate(immediate: boolean): Promise<boolean>;

  isBundleUpdateAvailable(): Promise<boolean>;

  isIncrementalUpdateAvailable(): Promise<boolean>;

  clearCache(): void;

  setUseOriginalBundle(original: boolean): Promise<boolean>;

  reloadApp(): Promise<boolean>;
}

export default UpdateManagerInterface;
