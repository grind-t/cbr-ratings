import { defineConfig } from "tsup";

export default defineConfig({
  name: "@grind-t/cbr-ratings",
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  experimentalDts: true,
  clean: true,
});
