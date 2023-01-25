import { join } from "path";
import { fileURLToPath } from "url";
import dts from "rollup-plugin-dts";

const cwd = fileURLToPath(new URL(".", import.meta.url));

const basicPlugins = [dts()];

const config = [
  {
    input: join(cwd, "src/index.ts"),
    output: {
      file: join(cwd, "dist/index.ts")
    },
    plugins: basicPlugins
  }
];

export default config;
