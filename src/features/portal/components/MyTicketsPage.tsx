"use client";

import Link from "next/link";
import { Alert, Badge, Card, EmptyState, Spinner } from "@/components/ui";
import { useMyTicketsPage } from "@/features/portal/components/useMyTicketsPage";

const STATUS_TONE: Record<string, "neutral" | "primary" | "danger"> = {
  open: "primary",
  pending: "danger",
  resolved: "neutral",
};

/** Écran `/portal/tickets?token=...` : l'historique des demandes du contact désigné par le jeton. */
export function MyTicketsPage({ token }: { token: string }) {
  const { loadState, tickets } = useMyTicketsPage(token);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-semibold text-foreground">Mes demandes</h1>

      <Card>
        {loadState.status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Spinner size="sm" />
            Chargement de vos demandes…
          </div>
        )}

        {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

        {loadState.status === "ready" && tickets.length === 0 && (
          <EmptyState title="Aucune demande" description="Vos demandes ouvertes apparaîtront ici." />
        )}

        {loadState.status === "ready" && tickets.length > 0 && (
          <ul className="flex flex-col divide-y divide-border">
            {tickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  href={`/portal/tickets/${ticket.id}?token=${encodeURIComponent(token)}`}
                  className="flex flex-col gap-2 py-3 transition-colors hover:bg-border/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{ticket.subject ?? "Demande sans sujet"}</p>
                    <p className="text-sm text-muted">{ticket.priority_label}</p>
                  </div>
                  <Badge tone={STATUS_TONE[ticket.status] ?? "neutral"}>{ticket.status_label}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
