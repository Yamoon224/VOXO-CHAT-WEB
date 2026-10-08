/**
 * Variables d'environnement exposées au client.
 *
 * Centralisées ici pour qu'une valeur manquante échoue tôt, au démarrage,
 * plutôt qu'au premier appel réseau dans un composant profondément imbriqué.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
};
