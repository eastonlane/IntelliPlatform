import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  splitting: false,
  outDir: "build",
  clean: true,
  bundle: true,
  dts: false,
});
