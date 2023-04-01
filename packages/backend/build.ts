import glob from "glob";
import {buildSync} from "esbuild";

const entryPoints = glob.sync("./src/*.ts");

buildSync({
  entryPoints,
  entryNames: "[name]/app",
  bundle: true,
  minify: true,
  outdir: "dist",
  platform: "node",
  target: "node18",
  mainFields: ["module", "main"],
  logLevel: "info",
});
