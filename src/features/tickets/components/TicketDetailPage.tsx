"use client";

import Link from "next/link";
import { Alert, Badge, Card, Spinner } from "@/components/ui";
import { useTicketDetailPage } from "@/features/tickets/components/useTicketDetailPage";
import { TicketPriorityForm } from "@/features/tickets/components/TicketPriorityForm";

/** Écran `/tickets/[id]` : priorité, échéance, et le lien vers la conversation pour répondre. */
export function TicketDetailPage({ ticketId }: { ticketId: string }) {
  const { loadState, ticket, actionError, update } = useTicketDetailPage(ticketId);

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement du ticket…
      </div>
    );
  }

  if (loadState.status === "error" || ticket === null) {
    return <Alert variant="error">{loadState.status === "error" ? loadState.error.message : "Ticket introuvable."}</Alert>;
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Demande</h2>
            <p className="text-sm font-medium text-foreground">{ticket.conversation.subject ?? "Sans sujet"}</p>
            <p className="mt-1 text-sm text-muted">
              {ticket.contact?.name ?? ticket.conversation.visitor_name ?? "Anonyme"}
              {(ticket.contact?.email ?? ticket.conversation.visitor_email) &&
                ` — ${ticket.contact?.email ?? ticket.conversation.visitor_email}`}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Badge tone="neutral">{ticket.conversation.channel_label}</Badge>
              <Badge tone="neutral">{ticket.conversation.status_label}</Badge>
              {ticket.conversation.assigned_user && <Badge tone="primary">Affecté à {ticket.conversation.assigned_user.name}</Badge>}
            </div>
            <Link
              href={`/conversations/${ticket.conversation.id}`}
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Voir la conversation et répondre →
            </Link>
          </Card>
        </div>

        <Card>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Priorité et échéance</h2>
          <TicketPriorityForm ticket={ticket} update={update} />
        </Card>
      </div>
    </div>
  );
}
