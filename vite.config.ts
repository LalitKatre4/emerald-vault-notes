// @lovable.dev/vite-tanstack-config provides the TanStack Start, React,
// Tailwind, tsconfig paths, and Nitro plugins used by this project.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    // GitHub Pages serves this project from /emerald-vault-notes/.
    // Local development keeps the normal root path.
    base: process.env.GITHUB_ACTIONS ? "/emerald-vault-notes/" : "/",
  },
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
    },
  },
  // Keep Nitro's output layout compatible with TanStack Start's Vite
  // prerender/preview server. This produces dist/client and dist/server.
  nitro: {
    preset: "cloudflare-module",
    output: {
      dir: "dist",
      serverDir: "dist/server",
      publicDir: "dist/client",
    },
  },
});
