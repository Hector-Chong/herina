import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";

const config = [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts"
    },
    plugins: [dts()]
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "commonjs"
    },
    plugins: [
      typescript({
        exclude: ["rollup.config.ts"]
      })
    ]
  }
];

export default config;
