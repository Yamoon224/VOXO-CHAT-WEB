"use client";

import { Badge } from "@/components/ui";
import type { PortalMessage } from "@/features/portal/types";

const SENDER_LABEL: Record<PortalMessage["sender_type"], string> = {
  visitor: "Vous",
  agent: "Support",
  ai: "Assistant",
  system: "Système",
};

const SENDER_TONE: Record<PortalMessage["sender_type"], "neutral" | "primary" | "danger"> = {
  visitor: "neutral",
  agent: "primary",
  ai: "primary",
  system: "danger",
};

export function PortalMessageThread({ messages }: { messages: PortalMessage[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {messages.map((message) => (
        <li key={message.id} className="rounded-md border border-border bg-surface p-3">
          <div className="mb-1 flex items-center gap-2">
            <Badge tone={SENDER_TONE[message.sender_type]}>{SENDER_LABEL[message.sender_type]}</Badge>
            <span className="text-xs text-muted">{new Date(message.created_at).toLocaleString("fr-FR")}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-foreground">{message.body}</p>
        </li>
      ))}
    </ul>
  );
}
