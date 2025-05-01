import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/db/index.ts",
    "src/db/schema/index.ts"
  ],
  format: ["esm"],
  splitting: false,
  outDir: "dist",
  bundle: false,
  dts: true,
});
