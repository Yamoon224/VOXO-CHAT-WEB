import { apiFetch } from "@/lib/api/client";
import type { PublicStatusOverview } from "@/features/status-page-public/types";

/** Page de statut publique (section 2.11) : jamais de jeton Sanctum. */
export function getOverview(workspaceId: string): Promise<{ data: PublicStatusOverview }> {
  return apiFetch(`/public/status/${workspaceId}`, { withAuth: false });
}

export function subscribe(workspaceId: string, email: string): Promise<void> {
  return apiFetch(`/public/status/${workspaceId}/subscribe`, { method: "POST", body: { email }, withAuth: false });
}

export function unsubscribe(token: string): Promise<void> {
  return apiFetch("/public/status/unsubscribe", { method: "POST", body: { token }, withAuth: false });
}
