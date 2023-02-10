import { ChunkAsset } from "./chunkAnalysers";
import { minify } from "terser";

const minifyCode = async (assets: Record<string, ChunkAsset[]>) => {
  for (const [_, modules] of Object.entries(assets)) {
    for (const module of modules) {
      if (module) {
        const output = await minify(module.code);

        module.code = output.code;
      }
    }
  }
};

export default minifyCode;
