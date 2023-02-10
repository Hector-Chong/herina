import { HerinaVersionsInfo } from "@herina-rn/shared";

interface UpdateManagerInterface {
  getVersionsJsonFromRemote(): Promise<HerinaVersionsInfo>;

  checkForUpdate(): Promise<boolean>;

  requestUpdate(): Promise<boolean>;

  requestFullUpdate(): Promise<boolean>;

  requestIncrementalUpdates(): Promise<boolean>;

  applyFullUpdate(immediate: boolean): Promise<boolean>;

  applyIncrementalUpdate(immediate: boolean): Promise<boolean>;

  applyUpdate(immediate: boolean): Promise<boolean>;

  isFullUpdateAvailable(): Promise<boolean>;

  isIncrementalUpdateAvailable(): Promise<boolean>;

  clearCache(): void;

  setUseOriginalBundle(original: boolean): Promise<boolean>;

  reloadApp(): void;
}

export default UpdateManagerInterface;
