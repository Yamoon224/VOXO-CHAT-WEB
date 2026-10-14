"use client";

import { Alert, Button } from "@/components/ui";
import { usePortalReplyForm } from "@/features/portal/components/usePortalReplyForm";

export function PortalReplyForm({ onSubmit }: { onSubmit: (body: string) => Promise<void> }) {
  const { body, setBody, isSubmitting, error, handleSubmit } = usePortalReplyForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      <label htmlFor="portal-reply-body" className="text-sm font-medium text-foreground">
        Votre réponse
      </label>
      <textarea
        id="portal-reply-body"
        rows={4}
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
      />

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Envoyer
        </Button>
      </div>
    </form>
  );
}
