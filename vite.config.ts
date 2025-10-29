import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const componentDir = path.resolve(dirname, "src", "components");
const entries: Record<string, string> = {};
fs.readdirSync(componentDir).forEach((folder) => {
  const entryPath = path.join(componentDir, folder, `${folder}.tsx`);
  if (fs.existsSync(entryPath)) {
    const relativePath = path.relative(path.resolve(dirname, "src"), entryPath);
    entries[relativePath] = entryPath;
  }
});

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: { quietDeps: true }
    }
  },
  build: {
    target: "esnext",
    outDir: path.resolve(dirname, "dist/components"),
    emptyOutDir: false,
    rollupOptions: {
      input: entries,
      preserveEntrySignatures: "strict",
      output: {
        preserveModules: true,
        preserveModulesRoot: path.resolve(dirname, "src"),
        format: "es",
        entryFileNames: "[name].js",
        chunkFileNames: "shared/[name]-[hash].js",
        assetFileNames: "[name][extname]"
      }
    }
  }
});
