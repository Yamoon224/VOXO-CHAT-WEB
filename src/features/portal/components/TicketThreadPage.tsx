"use client";

import Link from "next/link";
import { Alert, Badge, Card, Spinner } from "@/components/ui";
import { useTicketThreadPage } from "@/features/portal/components/useTicketThreadPage";
import { PortalMessageThread } from "@/features/portal/components/PortalMessageThread";
import { PortalReplyForm } from "@/features/portal/components/PortalReplyForm";

/** Écran `/portal/tickets/[id]?token=...` : le fil d'une demande, et la réponse du client. */
export function TicketThreadPage({ token, ticketId }: { token: string; ticketId: string }) {
  const { loadState, ticket, messages, actionError, reply } = useTicketThreadPage(token, ticketId);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <Link href={`/portal/tickets?token=${encodeURIComponent(token)}`} className="text-sm font-medium text-primary hover:underline">
        ← Mes demandes
      </Link>

      {loadState.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Chargement de votre demande…
        </div>
      )}

      {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

      {loadState.status === "ready" && ticket && (
        <>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{ticket.subject ?? "Demande sans sujet"}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Badge tone="neutral">{ticket.status_label}</Badge>
              <Badge tone="neutral">{ticket.priority_label}</Badge>
            </div>
          </div>

          {actionError && <Alert variant="error">{actionError.message}</Alert>}

          <Card>
            <PortalMessageThread messages={messages} />
          </Card>

          <Card>
            <PortalReplyForm onSubmit={reply} />
          </Card>
        </>
      )}
    </div>
  );
}
