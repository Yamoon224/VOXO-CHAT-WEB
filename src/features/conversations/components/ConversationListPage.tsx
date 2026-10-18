"use client";

import { Alert, Card, EmptyState, Spinner } from "@/components/ui";
import { useConversationListPage } from "@/features/conversations/components/useConversationListPage";
import { ConversationList } from "@/features/conversations/components/ConversationList";
import { InboxViewsBar } from "@/features/conversations/components/InboxViewsBar";
import type { ConversationChannel, ConversationStatus } from "@/features/conversations/types";

const STATUS_OPTIONS: { value: ConversationStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "open", label: "Ouverte" },
  { value: "pending", label: "En attente" },
  { value: "resolved", label: "Résolue" },
];

const CHANNEL_OPTIONS: { value: ConversationChannel | ""; label: string }[] = [
  { value: "", label: "Tous les canaux" },
  { value: "widget", label: "Widget" },
  { value: "email", label: "E-mail" },
  { value: "contact_form", label: "Formulaire de contact" },
  { value: "ticket", label: "Ticket" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "messenger", label: "Messenger" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "sms", label: "SMS" },
  { value: "x", label: "X" },
  { value: "viber", label: "Viber" },
  { value: "line", label: "Line" },
  { value: "telephony", label: "Téléphonie" },
];

/** Écran `/conversations` : boîte de réception partagée de l'espace courant, avec ses sous-boîtes (lot 5, section 2.4). */
export function ConversationListPage() {
  const {
    loadState,
    conversations,
    statusFilter,
    setStatusFilter,
    needsHumanOnly,
    setNeedsHumanOnly,
    channelFilter,
    setChannelFilter,
    assignedUserFilter,
    setAssignedUserFilter,
    inboxViews,
    activeViewId,
    applyView,
    clearView,
    saveCurrentAsView,
    removeView,
    members,
  } = useConversationListPage();

  return (
    <Card>
      <div className="mb-4 flex flex-col gap-4">
        <InboxViewsBar
          views={inboxViews}
          activeViewId={activeViewId}
          onApply={applyView}
          onClear={clearView}
          onSave={saveCurrentAsView}
          onRemove={removeView}
        />

        <div className="flex flex-wrap items-center gap-4">
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

          <div className="flex items-center gap-2">
            <label htmlFor="conversation-channel-filter" className="text-sm font-medium text-foreground">
              Canal
            </label>
            <select
              id="conversation-channel-filter"
              value={channelFilter}
              onChange={(event) => setChannelFilter(event.target.value as ConversationChannel | "")}
              className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
            >
              {CHANNEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="conversation-assignee-filter" className="text-sm font-medium text-foreground">
              Agent
            </label>
            <select
              id="conversation-assignee-filter"
              value={assignedUserFilter}
              onChange={(event) => setAssignedUserFilter(event.target.value)}
              className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
            >
              <option value="">Tous les agents</option>
              {members.map((member) => (
                <option key={member.id} value={member.user.id}>
                  {member.user.name}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={needsHumanOnly} onChange={(event) => setNeedsHumanOnly(event.target.checked)} />
            Escaladées seulement
          </label>
        </div>
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
