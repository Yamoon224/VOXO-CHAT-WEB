/**
 * Jeton d'API, conservé côté client uniquement.
 *
 * `localStorage` n'existe pas pendant le rendu serveur ni dans un
 * environnement de test sans DOM : chaque accès est protégé, pour que
 * l'absence du stockage dégrade la fonctionnalité (utilisateur déconnecté)
 * plutôt que de faire planter la page.
 */
const STORAGE_KEY = "voxo.token";

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function getToken(): string | null {
  if (!hasStorage()) return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // Stockage indisponible (navigation privée, quota atteint) : la session
    // ne survivra pas à un rechargement, ce qui reste préférable à une page
    // cassée.
  }
}

export function clearToken(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Rien à faire de plus : au pire la clé périmée reste, sans conséquence
    // puisqu'un jeton révoqué échoue de toute façon côté serveur.
  }
}
