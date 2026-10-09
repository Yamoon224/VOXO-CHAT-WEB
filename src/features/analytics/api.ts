import { apiFetch } from "@/lib/api/client";
import type { AnalyticsOverview } from "@/features/analytics/types";

/** `from`/`to` au format `YYYY-MM-DD`. Par défaut côté serveur : les 30 derniers jours. */
export function getOverview(from?: string, to?: string): Promise<{ data: AnalyticsOverview }> {
  return apiFetch("/workspace/analytics/overview", { query: { from, to } });
}
