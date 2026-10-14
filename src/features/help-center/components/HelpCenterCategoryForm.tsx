"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useHelpCenterCategoryForm } from "@/features/help-center/components/useHelpCenterCategoryForm";

export function HelpCenterCategoryForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: { name: string } | null;
  onSubmit: (name: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const { name, setName, isSubmitting, error, handleSubmit } = useHelpCenterCategoryForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-wrap items-end gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Nom de la catégorie" required value={name} onChange={(event) => setName(event.target.value)} />

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
