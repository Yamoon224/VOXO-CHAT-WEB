"use client";

import { Alert, Button } from "@/components/ui";
import { useQaEntryForm } from "@/features/knowledge/components/useQaEntryForm";

/**
 * Sert à la fois à ajouter et à modifier une entrée : le parent démonte et
 * remonte ce formulaire (via la prop `key`) quand il bascule d'une entrée à
 * l'autre, ce qui réinitialise son état local sans logique supplémentaire ici.
 */
export function QaEntryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: { question: string; answer: string } | null;
  onSubmit: (question: string, answer: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const { question, setQuestion, answer, setAnswer, isSubmitting, error, handleSubmit } = useQaEntryForm(
    onSubmit,
    initial ?? null,
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="qa-question" className="text-sm font-medium text-foreground">
          Question
        </label>
        <input
          id="qa-question"
          required
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="qa-answer" className="text-sm font-medium text-foreground">
          Réponse
        </label>
        <textarea
          id="qa-answer"
          required
          rows={3}
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
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
