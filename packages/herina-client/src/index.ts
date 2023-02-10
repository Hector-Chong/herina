import AppCapacityImplements from "./app";
import UpdateManager from "./manager";
import UpdateManagerStatic from "./manager";
import Herina from "./native";

const appCapacity = new AppCapacityImplements(Herina);

let manager: UpdateManager;

export const registerUpdateManager = (baseUrl = "", ignoreRelease = false) => {
  if (!manager) {
    manager = UpdateManagerStatic.getInstance(
      appCapacity,
      baseUrl,
      ignoreRelease
    );
  }

  return manager;
};

export const getUpdateManager = () => {
  if (!manager) {
    throw new Error(
      "Do not call `getUpdateManager` before registering UpdateManager"
    );
  }

  return manager;
};

export { registerAsset } from "./assets";
