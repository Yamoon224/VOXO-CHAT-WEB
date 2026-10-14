import { apiFetch } from "@/lib/api/client";
import type { PaginatedTickets, Ticket, TicketPriority } from "@/features/tickets/types";

export function listTickets(filters: { priority?: TicketPriority | ""; overdue?: boolean } = {}): Promise<PaginatedTickets> {
  return apiFetch("/workspace/tickets", {
    query: { priority: filters.priority || undefined, overdue: filters.overdue ?? undefined },
  });
}

export function getTicket(ticketId: string): Promise<{ data: Ticket }> {
  return apiFetch(`/workspace/tickets/${ticketId}`);
}

export function updateTicket(
  ticketId: string,
  payload: { priority?: TicketPriority; due_at?: string | null },
): Promise<{ data: Ticket }> {
  return apiFetch(`/workspace/tickets/${ticketId}`, { method: "PUT", body: payload });
}

export function openTicketFromConversation(
  conversationId: string,
  payload: { priority?: TicketPriority; due_at?: string | null } = {},
): Promise<{ data: Ticket }> {
  return apiFetch(`/workspace/conversations/${conversationId}/ticket`, { method: "POST", body: payload });
}
