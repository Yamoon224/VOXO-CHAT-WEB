"use client";

import { Badge } from "@/components/ui";
import type { Message } from "@/features/conversations/types";

const SENDER_TONE: Record<Message["sender_type"], "neutral" | "primary" | "danger"> = {
  visitor: "neutral",
  agent: "primary",
  ai: "primary",
  system: "danger",
};

export function MessageThread({ messages }: { messages: Message[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {messages.map((message) => (
        <li
          key={message.id}
          className={`rounded-md border p-3 ${
            message.visibility === "internal" ? "border-dashed border-border-strong bg-border/20" : "border-border bg-surface"
          }`}
        >
          <div className="mb-1 flex items-center gap-2">
            <Badge tone={SENDER_TONE[message.sender_type]}>
              {message.sender_user ? message.sender_user.name : message.sender_label}
            </Badge>
            {message.visibility === "internal" && <Badge tone="danger">Note interne</Badge>}
            <span className="text-xs text-muted">{new Date(message.created_at).toLocaleString("fr-FR")}</span>
          </div>
          <p className="whitespace-pre-wrap text-sm text-foreground">{message.body}</p>
          {message.citations.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
              {message.citations.map((citation, index) => (
                <li key={index} className="text-xs text-muted">
                  {citation.title}
                  {citation.citation_url && (
                    <>
                      {" — "}
                      <a href={citation.citation_url} target="_blank" rel="noreferrer" className="text-primary">
                        {citation.citation_url}
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
