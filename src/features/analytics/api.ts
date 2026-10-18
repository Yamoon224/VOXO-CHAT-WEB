import { apiFetch } from "@/lib/api/client";
import { env } from "@/lib/env";
import { getToken } from "@/lib/auth/token-store";
import type { AnalyticsOverview } from "@/features/analytics/types";

/** `from`/`to` au format `YYYY-MM-DD`. Par défaut côté serveur : les 30 derniers jours. */
export function getOverview(from?: string, to?: string): Promise<{ data: AnalyticsOverview }> {
  return apiFetch("/workspace/analytics/overview", { query: { from, to } });
}

/**
 * Pas `apiFetch` : la réponse est un CSV, pas du JSON. Récupère le fichier
 * authentifié puis déclenche le téléchargement navigateur directement —
 * même mécanique que `contactsApi.exportContacts`.
 */
export async function exportAnalytics(from?: string, to?: string): Promise<void> {
  const token = getToken();
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  const queryString = query.toString() ? `?${query.toString()}` : "";

  const response = await fetch(`${env.apiBaseUrl.replace(/\/$/, "")}/workspace/analytics/export${queryString}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error("Échec de l'export.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = "analytics.csv";
  link.click();
  URL.revokeObjectURL(objectUrl);
}
