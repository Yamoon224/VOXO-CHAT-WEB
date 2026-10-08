import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { uniqueEmail } from "./support/fixtures";

test.describe("Inscription, connexion et déconnexion", () => {
  test("un visiteur s'inscrit, atterrit sur le tableau de bord, se déconnecte puis se reconnecte", async ({ page }) => {
    const email = uniqueEmail("awa");
    const password = "motdepasse-solide";

    await page.goto("/register");
    await page.getByLabel("Nom", { exact: true }).fill("Awa Koné");
    await page.getByLabel("Adresse e-mail").fill(email);
    await page.getByLabel("Mot de passe", { exact: true }).fill(password);
    await page.getByLabel("Confirmer le mot de passe").fill(password);
    await page.getByLabel("Nom de votre espace de travail").fill("Boutique Awa");
    await page.getByRole("button", { name: "Créer mon compte" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: /Bonjour Awa Koné/ })).toBeVisible();

    await page.getByRole("button", { name: "Se déconnecter" }).click();
    await expect(page).toHaveURL(/\/login$/);

    // Next.js conserve la page précédente masquée dans le DOM pour accélérer
    // un retour en arrière (voir "Navigation with Activity" dans sa
    // documentation) : sans ce rechargement, les champs du formulaire
    // d'inscription resteraient présents à côté de ceux de connexion.
    await page.reload();

    await page.getByLabel("Adresse e-mail").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("des identifiants invalides affichent une erreur sans naviguer", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Adresse e-mail").fill(uniqueEmail("inconnu"));
    await page.getByLabel("Mot de passe").fill("n-importe-quoi");
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Pas `getByRole("alert")` seul : Next.js ajoute son propre annonceur de
    // route sous le même rôle, vide, qui rendrait le sélecteur ambigu.
    await expect(page.getByText("Identifiants invalides.")).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("la page de connexion ne présente pas de violation d'accessibilité critique", async ({ page }) => {
    await page.goto("/login");

    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");

    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
