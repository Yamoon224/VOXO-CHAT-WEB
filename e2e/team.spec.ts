import { test, expect } from "@playwright/test";
import { uniqueEmail } from "./support/fixtures";

async function registerAndSignIn(page: import("@playwright/test").Page, name: string) {
  const email = uniqueEmail(name.toLowerCase());
  const password = "motdepasse-solide";

  await page.goto("/register");
  await page.getByLabel("Nom", { exact: true }).fill(name);
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByLabel("Mot de passe", { exact: true }).fill(password);
  await page.getByLabel("Confirmer le mot de passe").fill(password);
  await page.getByLabel("Nom de votre espace de travail").fill(`${name} Corp`);
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);

  return email;
}

test("le propriétaire invite un coéquipier, qui apparaît en attente", async ({ page }) => {
  await registerAndSignIn(page, "Awa");

  const teammateEmail = uniqueEmail("kofi");
  await page.goto("/settings/team");
  await page.getByLabel("Adresse e-mail").fill(teammateEmail);
  await page.getByRole("button", { name: "Inviter" }).click();

  // L'e-mail part par le pilote « log » en développement : ce test vérifie le
  // comportement observable côté interface (l'invitation apparaît en attente),
  // pas la livraison réelle d'un e-mail.
  await expect(page.getByText(teammateEmail)).toBeVisible();
});
