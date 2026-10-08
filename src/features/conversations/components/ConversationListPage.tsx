"use client";

import { Alert, Card, EmptyState, Spinner } from "@/components/ui";
import { useConversationListPage } from "@/features/conversations/components/useConversationListPage";
import { ConversationList } from "@/features/conversations/components/ConversationList";
import type { ConversationStatus } from "@/features/conversations/types";

const STATUS_OPTIONS: { value: ConversationStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "open", label: "Ouverte" },
  { value: "pending", label: "En attente" },
  { value: "resolved", label: "Résolue" },
];

/** Écran `/conversations` : boîte de réception partagée de l'espace courant. */
export function ConversationListPage() {
  const { loadState, conversations, statusFilter, setStatusFilter, needsHumanOnly, setNeedsHumanOnly } =
    useConversationListPage();

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="conversation-status-filter" className="text-sm font-medium text-foreground">
            Statut
          </label>
          <select
            id="conversation-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as ConversationStatus | "")}
            className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={needsHumanOnly} onChange={(event) => setNeedsHumanOnly(event.target.checked)} />
          Escaladées seulement
        </label>
      </div>

      {loadState.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Chargement des conversations…
        </div>
      )}

      {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

      {loadState.status === "ready" && conversations.length === 0 && (
        <EmptyState title="Aucune conversation" description="Les conversations du widget apparaissent ici." />
      )}

      {loadState.status === "ready" && conversations.length > 0 && <ConversationList conversations={conversations} />}
    </Card>
  );
}
