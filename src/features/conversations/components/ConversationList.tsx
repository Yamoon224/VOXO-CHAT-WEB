"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import type { Conversation, ConversationStatus } from "@/features/conversations/types";

const STATUS_TONE: Record<ConversationStatus, "neutral" | "primary" | "danger"> = {
  open: "primary",
  pending: "danger",
  resolved: "neutral",
};

export function ConversationList({ conversations }: { conversations: Conversation[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {conversations.map((conversation) => (
        <li key={conversation.id}>
          <Link
            href={`/conversations/${conversation.id}`}
            className="flex flex-col gap-2 py-3 transition-colors hover:bg-border/20 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {conversation.visitor_name ?? conversation.visitor_email ?? "Visiteur anonyme"}
              </p>
              <p className="text-sm text-muted">
                {conversation.assigned_user ? `Affectée à ${conversation.assigned_user.name}` : "Non affectée"}
                {conversation.last_message_at && ` — ${new Date(conversation.last_message_at).toLocaleString("fr-FR")}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {conversation.needs_human && <Badge tone="danger">Escaladée</Badge>}
              <Badge tone={STATUS_TONE[conversation.status]}>{conversation.status_label}</Badge>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
