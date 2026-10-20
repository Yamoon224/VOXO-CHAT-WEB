"use client";

import { useRef, useState } from "react";
import { Alert, Button } from "@/components/ui";
import { useReplyForm } from "@/features/conversations/components/useReplyForm";
import type { AiSuggestion, CannedResponse, MessageVisibility } from "@/features/conversations/types";

const TYPING_THROTTLE_MS = 3000;

export function ReplyForm({
  cannedResponses,
  onSubmit,
  onSuggestReply,
  onTyping,
}: {
  cannedResponses: CannedResponse[];
  onSubmit: (body: string, visibility: MessageVisibility) => Promise<void>;
  onSuggestReply: () => Promise<AiSuggestion | null>;
  /** Indicateur de saisie (section 4.1) : whisper temps réel, pas d'appel API. */
  onTyping?: () => void;
}) {
  const { body, setBody, visibility, setVisibility, isSubmitting, error, handleSubmit } = useReplyForm(onSubmit);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionCitations, setSuggestionCitations] = useState<AiSuggestion["citations"]>([]);
  const lastTypingSentAt = useRef(0);

  function notifyTyping() {
    const now = Date.now();
    if (now - lastTypingSentAt.current < TYPING_THROTTLE_MS) return;
    lastTypingSentAt.current = now;
    onTyping?.();
  }

  async function handleSuggestReply() {
    setIsSuggesting(true);
    try {
      const suggestion = await onSuggestReply();
      if (suggestion) {
        setBody(suggestion.content);
        setSuggestionCitations(suggestion.citations);
      }
    } finally {
      setIsSuggesting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      {cannedResponses.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="canned-response-picker" className="text-sm font-medium text-foreground">
            Insérer une réponse pré-enregistrée
          </label>
          <select
            id="canned-response-picker"
            value=""
            onChange={(event) => {
              const picked = cannedResponses.find((response) => response.id === event.target.value);
              if (picked) {
                setBody((current) => (current ? `${current}\n${picked.body}` : picked.body));
              }
            }}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            <option value="">Choisir…</option>
            {cannedResponses.map((response) => (
              <option key={response.id} value={response.id}>
                {response.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="reply-body" className="text-sm font-medium text-foreground">
            Message
          </label>
          <Button variant="secondary" type="button" onClick={handleSuggestReply} isLoading={isSuggesting}>
            Suggérer une réponse
          </Button>
        </div>
        <textarea
          id="reply-body"
          required
          rows={3}
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            notifyTyping();
          }}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
        {suggestionCitations.length > 0 && (
          <ul className="flex flex-col gap-1 border-t border-border pt-2">
            {suggestionCitations.map((citation, index) => (
              <li key={index} className="text-xs text-muted">
                Source : {citation.title}
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
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={visibility === "internal"}
            onChange={(event) => setVisibility(event.target.checked ? "internal" : "public")}
          />
          Note interne (non visible du visiteur)
        </label>

        <Button type="submit" isLoading={isSubmitting}>
          {visibility === "internal" ? "Ajouter la note" : "Répondre"}
        </Button>
      </div>
    </form>
  );
}
