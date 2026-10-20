import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { env } from "@/lib/env";
import { getToken } from "@/lib/auth/token-store";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<"reverb"> | null | undefined;

/**
 * `null` si aucun serveur Reverb n'est configuré (section 4.1) : l'appelant
 * retombe alors sur le sondage, comme avant ce lot. `/broadcasting/auth` vit
 * hors `/api/v1` (voir `bootstrap/app.php` côté backend), donc hors de
 * `apiBaseUrl`.
 */
export function getEcho(): Echo<"reverb"> | null {
  if (echo !== undefined) return echo;

  if (!env.reverb.key || typeof window === "undefined") {
    echo = null;
    return echo;
  }

  window.Pusher = Pusher;

  const token = getToken();

  echo = new Echo({
    broadcaster: "reverb",
    key: env.reverb.key,
    wsHost: env.reverb.host,
    wsPort: env.reverb.port,
    wssPort: env.reverb.port,
    forceTLS: env.reverb.scheme === "https",
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${env.apiBaseUrl.replace(/\/api\/v1\/?$/, "")}/broadcasting/auth`,
    auth: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  });

  return echo;
}

/** Pour les tests et la déconnexion : oublie l'instance pour que le prochain appel en recrée une. */
export function resetEcho(): void {
  echo?.disconnect();
  echo = undefined;
}
