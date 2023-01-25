import ts from "rollup-plugin-ts";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const { join } = require("path");

const cwd = __dirname;

const config = {
  input: join(cwd, "src/index.ts"),
  output: [
    {
      file: join(cwd, "dist/index.js"),
      format: "cjs",
      exports: "named"
    }
  ],
  plugins: [json(), ts(), commonjs()]
};

module.exports = config;
