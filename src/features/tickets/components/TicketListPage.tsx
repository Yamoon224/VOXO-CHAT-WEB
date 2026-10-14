"use client";

import { Alert, Card, EmptyState, Spinner } from "@/components/ui";
import { useTicketListPage } from "@/features/tickets/components/useTicketListPage";
import { TicketList } from "@/features/tickets/components/TicketList";
import type { TicketPriority } from "@/features/tickets/types";

const PRIORITY_OPTIONS: { value: TicketPriority | ""; label: string }[] = [
  { value: "", label: "Toutes les priorités" },
  { value: "low", label: "Basse" },
  { value: "normal", label: "Normale" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" },
];

/** Écran `/tickets` : les demandes ouvertes depuis une conversation ou le portail client. */
export function TicketListPage() {
  const { loadState, tickets, priorityFilter, setPriorityFilter, overdueOnly, setOverdueOnly } = useTicketListPage();

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="ticket-priority-filter" className="text-sm font-medium text-foreground">
            Priorité
          </label>
          <select
            id="ticket-priority-filter"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as TicketPriority | "")}
            className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={overdueOnly} onChange={(event) => setOverdueOnly(event.target.checked)} />
          En retard seulement
        </label>
      </div>

      {loadState.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Chargement des tickets…
        </div>
      )}

      {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

      {loadState.status === "ready" && tickets.length === 0 && (
        <EmptyState
          title="Aucun ticket"
          description="Transformez une conversation en ticket, ou attendez une demande ouverte depuis le portail client."
        />
      )}

      {loadState.status === "ready" && tickets.length > 0 && <TicketList tickets={tickets} />}
    </Card>
  );
}
