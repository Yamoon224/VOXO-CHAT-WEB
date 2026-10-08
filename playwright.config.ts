import { defineConfig, devices } from "@playwright/test";

/**
 * Suite généralisée (Playwright) : parcours complets dans un vrai navigateur,
 * contre le backend de test. Le backend n'est pas démarré ici : il doit déjà
 * tourner (`php artisan serve`), avec une base de données migrée et vidée
 * entre deux exécutions — voir e2e/README.md.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: "list",
  // La compilation à la demande du serveur de développement (première visite
  // de chaque route) peut dépasser les délais par défaut sur une machine
  // chargée ; les délais par défaut de Playwright supposent un serveur déjà
  // construit.
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium-desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
