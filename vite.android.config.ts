import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    react(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,

    // Important: don't use Lightning CSS minifier
    cssMinify: false,

    rollupOptions: {
      input: path.resolve(process.cwd(), "src/android-main.tsx"),
    },
  },
});