import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // `vmThreads` casse la résolution ESM/CJS de `@swc/helpers` (dépendance
    // de `next/link`) même avec `server.deps.inline` : le gain de 55 % sur
    // l'initialisation de jsdom ne vaut pas cette fragilité. Le pool par
    // défaut (`forks`) reste plus lent mais correct.
    setupFiles: ["./vitest.setup.ts"],
    globals: false,
    css: true,
    exclude: ["node_modules", ".next", "e2e"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
