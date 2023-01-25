import commonjs from "@rollup/plugin-commonjs";
import { join } from "path";
import { fileURLToPath } from "url";
import typescript from "@rollup/plugin-typescript";

const cwd = fileURLToPath(new URL(".", import.meta.url));

const basicOutput = {
  intro: 'const env = "prod";',
  format: "cjs",
  exports: "named",
  interop: "auto",
  globals: {
    lodash: "lodash"
  }
};

const basicPlugins = [
  typescript({}),
  commonjs({
    include: ["./src/**", "node_modules/**"]
  })
];

const config = [
  {
    input: join(cwd, "src/index.ts"),
    output: {
      file: join(cwd, "dist/index.js"),
      ...basicOutput
    },
    plugins: basicPlugins
  },
  {
    input: join(cwd, "src/metroTransformer/index.ts"),
    output: {
      file: join(cwd, "dist/metroTransformer.js"),
      ...basicOutput
    },
    plugins: basicPlugins
  },
  {
    input: join(cwd, "src/babelTransformer/index.ts"),
    output: {
      file: join(cwd, "dist/babelTransformer.js"),
      ...basicOutput
    },
    plugins: basicPlugins
  }
];

export default config;
