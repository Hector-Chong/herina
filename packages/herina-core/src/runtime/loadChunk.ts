import loadChunkModules from "./loadChunkModules";

export interface ChunkLoading {
  resolve: (value: unknown) => void;
  reject: (value: unknown) => void;
  promise: Promise<any>;
  loaded: boolean;
  error: boolean;
  errorMessage: string;
  modules: Map<number, ChunkModule>;
  loadModules: (modules: ChunkModule[]) => void;
}

export interface ChunkModule {
  id: number;
  factory: Function;
}

export type InstalledChunks = Record<string, ChunkLoading>;

export const definedModules: Map<number, Function> = new Map();

const context = global;

context.loadChunkModules = loadChunkModules;

let installedChunks: InstalledChunks = context.installedChunks;

if (!installedChunks) installedChunks = context.installedChunks = {};

const loadChunkModulesId: Set<number> = new Set();

const loadChunk = (chunkName: string) => {
  const promises: Promise<any>[] = [];

  scheduleChunk(chunkName, promises);

  return Promise.all(promises);
};

const scheduleChunk = (chunkName: string, promises: Promise<any>[]) => {
  const installedChunkData = installedChunks[chunkName];

  if (!installedChunkData || !installedChunkData.loaded) {
    if (installedChunkData) {
      promises.push(installedChunkData.promise);
    } else {
      const promise = new Promise((resolve, reject) => {
        installedChunks[chunkName] = {
          promise,
          resolve,
          reject,
          loaded: false,
          error: false,
          errorMessage: "",
          modules: new Map(),
          loadModules: (modules: ChunkModule[]) => {
            modules.forEach((module) => {
              if (loadChunkModulesId.has(module.id)) {
                return;
              }

              installedChunks[chunkName].modules.set(module.id, module);

              module.factory();
            });

            installedChunks[chunkName].loaded = true;
            resolve(true);
          }
        };
      });

      const installedChunkData = installedChunks[chunkName];

      promises.push(promise);

      const error = new Error();
      const loadingEnded = (errorMessage = "") => {
        if (!installedChunkData.loaded) {
          installedChunks[chunkName] = undefined;
        }

        if (installedChunkData.error) {
          error.message = errorMessage;

          installedChunkData.reject(error);
        }
      };

      requestChunk(chunkName, loadingEnded);
    }
  }
};

const requestChunk = async (
  chunkName: string,
  done: (errorMessage: string) => void
) => {
  const installedChunkData = installedChunks[chunkName];

  const onScriptComplete = (errorMessage = "") => {
    clearTimeout(timeout);

    done(errorMessage);
  };
  const timeout = setTimeout(onScriptComplete, 120000);

  try {
    const res = await fetch(`${global.baseUrl}/dynamic/${chunkName}`, {
      cache: "no-store"
    });

    if (res.status !== 200) {
      installedChunkData.error = true;

      return onScriptComplete(res.statusText);
    }

    const body = await res.text();
    const execuse = new Function(body);

    execuse();

    onScriptComplete();
  } catch (e: any) {
    installedChunkData.error = true;

    return onScriptComplete(e.message);
  }
};

export default loadChunk;
