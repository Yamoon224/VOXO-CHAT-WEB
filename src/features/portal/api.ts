import { apiFetch } from "@/lib/api/client";
import type { PortalMessage, PortalTicket } from "@/features/portal/types";

/**
 * Portail client, sans compte (section 2.7) : jamais de jeton Sanctum, l'accès
 * tient au jeton signé du lien reçu par e-mail, ou n'en demande aucun pour
 * ouvrir une nouvelle demande.
 */
export function openTicket(
  workspaceId: string,
  payload: { email: string; name?: string; subject: string; message: string },
): Promise<{ data: PortalTicket }> {
  return apiFetch(`/public/tickets/${workspaceId}/submissions`, { method: "POST", body: payload, withAuth: false });
}

export function requestPortalLink(workspaceId: string, email: string): Promise<void> {
  return apiFetch(`/public/tickets/${workspaceId}/portal-links`, { method: "POST", body: { email }, withAuth: false });
}

export function listMyTickets(token: string): Promise<{ data: PortalTicket[] }> {
  return apiFetch("/public/tickets/portal/tickets", { query: { token }, withAuth: false });
}

export function getMyTicket(token: string, ticketId: string): Promise<{ data: { ticket: PortalTicket; messages: PortalMessage[] } }> {
  return apiFetch(`/public/tickets/portal/tickets/${ticketId}`, { query: { token }, withAuth: false });
}

export function replyToTicket(token: string, ticketId: string, body: string): Promise<{ data: PortalTicket }> {
  return apiFetch(`/public/tickets/portal/tickets/${ticketId}/messages`, {
    method: "POST",
    body: { token, body },
    withAuth: false,
  });
}
