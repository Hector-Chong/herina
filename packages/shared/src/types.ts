export type {
  HerinaConfig,
  HerinaManifest,
  HerinaConfigManualChunks,
  HerinaVersionsItem,
  HerinaVersionsInfo,
  AppVersionConfig,
  HerinaBuildEventNames,
  HerinaBuildEvents,
  HerinaBuildEnvironment,
  HerinaSupportPlatforms,
  HerinaConfigInternal
} from "../../../typings/herina";

export type { Recordable } from "../../../typings/global";

export enum HerinaUpdateType {
  FULL,
  INCREMENTAL,
  ALL
}
