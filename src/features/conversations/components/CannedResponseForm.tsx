"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useCannedResponseForm } from "@/features/conversations/components/useCannedResponseForm";

export function CannedResponseForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: { title: string; body: string } | null;
  onSubmit: (title: string, body: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const { title, setTitle, body, setBody, isSubmitting, error, handleSubmit } = useCannedResponseForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Titre" required value={title} onChange={(event) => setTitle(event.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="canned-response-body" className="text-sm font-medium text-foreground">
          Texte
        </label>
        <textarea
          id="canned-response-body"
          required
          rows={3}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Ajouter"}
        </Button>
        {initial && onCancel && (
          <Button variant="ghost" type="button" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}
