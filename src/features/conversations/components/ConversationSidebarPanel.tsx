"use client";

import { Badge, Button, Card } from "@/components/ui";
import type { Conversation, ConversationStatus } from "@/features/conversations/types";
import type { Member } from "@/features/team/types";

const STATUS_OPTIONS: { value: ConversationStatus; label: string }[] = [
  { value: "open", label: "Ouverte" },
  { value: "pending", label: "En attente" },
  { value: "resolved", label: "Résolue" },
];

export function ConversationSidebarPanel({
  conversation,
  members,
  canManage,
  onChangeStatus,
  onAssign,
  onSummarize,
  onAnalyzeSentiment,
}: {
  conversation: Conversation;
  members: Member[];
  canManage: boolean;
  onChangeStatus: (status: ConversationStatus) => void;
  onAssign: (userId: string | null) => void;
  onSummarize: () => void;
  onAnalyzeSentiment: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Visiteur</h2>
        <p className="text-sm text-foreground">{conversation.visitor_name ?? "Anonyme"}</p>
        {conversation.visitor_email && <p className="text-sm text-muted">{conversation.visitor_email}</p>}
        {conversation.needs_human && <Badge tone="danger">Escaladée vers un humain</Badge>}
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Statut</h2>
        <select
          disabled={!canManage}
          value={conversation.status}
          onChange={(event) => onChangeStatus(event.target.value as ConversationStatus)}
          className="w-full rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Affectation</h2>
        <select
          disabled={!canManage}
          value={conversation.assigned_user?.id ?? ""}
          onChange={(event) => onAssign(event.target.value || null)}
          className="w-full rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
        >
          <option value="">Non affectée</option>
          {members.map((member) => (
            <option key={member.id} value={member.user.id}>
              {member.user.name}
            </option>
          ))}
        </select>
      </Card>

      {canManage && (
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Agent IA</h2>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-medium text-muted">Résumé</p>
              <p className="text-sm text-foreground">{conversation.summary ?? "—"}</p>
              <Button variant="secondary" type="button" className="mt-2" onClick={onSummarize}>
                Résumer
              </Button>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Sentiment</p>
              <p className="text-sm text-foreground">{conversation.sentiment ?? "—"}</p>
              <Button variant="secondary" type="button" className="mt-2" onClick={onAnalyzeSentiment}>
                Analyser le sentiment
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
