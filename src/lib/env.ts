/**
 * Variables d'environnement exposées au client.
 *
 * Centralisées ici pour qu'une valeur manquante échoue tôt, au démarrage,
 * plutôt qu'au premier appel réseau dans un composant profondément imbriqué.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  /** Vide : aucun serveur Reverb configuré, la boîte de réception retombe sur le sondage (section 4.1). */
  reverb: {
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY ?? "",
    host: process.env.NEXT_PUBLIC_REVERB_HOST ?? "localhost",
    port: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? "8080"),
    scheme: process.env.NEXT_PUBLIC_REVERB_SCHEME ?? "http",
  },
};
