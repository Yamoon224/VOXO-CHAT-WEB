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
    // Le défaut (5000ms) suffit fichier par fichier, mais la suite complète
    // (77 fichiers, pool `forks`) sature le CPU et fait dépasser des tests
    // par ailleurs corrects — jamais en isolation. Observé empiriquement :
    // des tests différents échouent à chaque exécution complète.
    testTimeout: 20000,
    // Ce poste n'a que 4 cœurs logiques : lancer un fork par fichier (77 en
    // même temps) sature le CPU au point de faire planter le canal IPC entre
    // le worker et le processus principal (« Timeout waiting for worker to
    // respond »), pas seulement les tests. Borner la concurrence corrige la
    // cause, pas juste le symptôme que `testTimeout` masquait.
    maxWorkers: "75%",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
