import { parse } from "@babel/parser";
import generate from "@babel/generator";
import { readFileSync, writeFileSync } from "fs";
import buildBundle from "./buildBundle";
import {
  ChunkAsset,
  dynamicChunkAnalyser,
  mainChunkAnalyser,
  vendorChunkAnalyser
} from "./chunkAssetAnalysers";
import minifyCode from "./minifyCode";
import {
  addDynamicChunkReversedToManifest,
  manifest,
  removeDuplicatedDependencies
} from "./manifest";
import bundleTransformer from "../bundleTransformer";
import { createManifestIfNotExist } from "../utils/manifest";
import { writeJsonSync } from "fs-extra";
import { prepareToBuild } from "./prerequisite";
import { HerinaConfig } from "@herina-rn/shared";
import path from "path";
import removeDynamicFromBundleTransformer from "../bundleTransformer/removeDynamicFromBundleTransformer";

const ora = require("ora");

const writeAssets = (assets: Record<string, ChunkAsset[]>) => {
  for (const [_, modules] of Object.entries(assets)) {
    for (const module of modules) {
      writeFileSync(module.path, module.code);
    }
  }
};

const rewriteBundle = (config: HerinaConfig) => {
  const bundlePath = path.resolve(config.outputPath, "bundle.js");
  const bundleStream = readFileSync(bundlePath);

  const ast = parse(bundleStream.toString());

  removeDynamicFromBundleTransformer(ast);

  const { code } = generate(ast);

  writeFileSync(bundlePath, code);
};

const buildChunks = async (config: HerinaConfig) => {
  config = prepareToBuild(config);

  const spinner = ora("Building bundle...").start();

  const bundlePath = await buildBundle(config);
  const bundleStream = readFileSync(bundlePath);

  const manifistFromDisk = createManifestIfNotExist(config);

  if (manifistFromDisk.chunks.dynamic) {
    manifest.chunks.dynamic = manifistFromDisk.chunks.dynamic;
  }

  if (manifest.chunks.dynamic) {
    addDynamicChunkReversedToManifest(manifest);
    removeDuplicatedDependencies(manifest);
  }

  const { ast, dynamicModulesGraph, mainChunkCode } = bundleTransformer(
    config,
    parse(bundleStream.toString())
  );

  const { code: vendorCode } = generate(ast);

  const assets: Record<string, ChunkAsset[]> = {
    dynamic: dynamicChunkAnalyser(config, manifest, dynamicModulesGraph),
    main: mainChunkAnalyser(config, mainChunkCode),
    vendor: vendorChunkAnalyser(config, vendorCode)
  };

  if (config.minify) {
    await minifyCode(assets);
  }

  writeAssets(assets);

  writeJsonSync(config.manifestPath, manifest);

  rewriteBundle(config);

  spinner.succeed("Bundle is built successfully.").stop();

  return assets;
};

export default buildChunks;
