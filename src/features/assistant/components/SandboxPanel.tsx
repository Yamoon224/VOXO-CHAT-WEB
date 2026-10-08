"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Spinner } from "@/components/ui";
import type { ApiError } from "@/lib/api/errors";
import type { AiReply } from "@/features/assistant/types";

/** Bac à sable (section 2.2) : teste l'agent IA avant activation, sans toucher à aucune conversation. */
export function SandboxPanel({
  reply,
  error,
  isTesting,
  onTest,
}: {
  reply: AiReply | null;
  error: ApiError | null;
  isTesting: boolean;
  onTest: (message: string) => Promise<void>;
}) {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (message.trim().length === 0) {
      return;
    }
    await onTest(message);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} noValidate className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="sandbox-message" className="text-sm font-medium text-foreground">
            Message de test
          </label>
          <input
            id="sandbox-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Quels sont vos horaires ?"
            className="mt-1.5 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          />
        </div>
        <Button type="submit" isLoading={isTesting}>
          Tester
        </Button>
      </form>

      {error && <Alert variant="error">{error.message}</Alert>}

      {isTesting && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          L&apos;agent réfléchit…
        </div>
      )}

      {!isTesting && reply && (
        <div className="rounded-md border border-border bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">Réponse simulée</p>
            <span className="text-xs text-muted">confiance {reply.confidence.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-sm text-foreground">{reply.content}</p>
          {reply.citations.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
              {reply.citations.map((citation, index) => (
                <li key={index} className="text-xs text-muted">
                  {citation.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
