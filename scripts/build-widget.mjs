import { build, context } from "esbuild";

const watch = process.argv.includes("--watch");

const options = {
  entryPoints: ["widget-src/index.ts"],
  bundle: true,
  outfile: "public/widget.js",
  format: "iife",
  target: "es2019",
  minify: !watch,
  sourcemap: watch,
  logLevel: "info",
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
} else {
  await build(options);
}
