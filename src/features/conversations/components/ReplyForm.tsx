"use client";

import { Alert, Button } from "@/components/ui";
import { useReplyForm } from "@/features/conversations/components/useReplyForm";
import type { CannedResponse, MessageVisibility } from "@/features/conversations/types";

export function ReplyForm({
  cannedResponses,
  onSubmit,
}: {
  cannedResponses: CannedResponse[];
  onSubmit: (body: string, visibility: MessageVisibility) => Promise<void>;
}) {
  const { body, setBody, visibility, setVisibility, isSubmitting, error, handleSubmit } = useReplyForm(onSubmit);

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
        <label htmlFor="reply-body" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="reply-body"
          required
          rows={3}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
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
