"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useContactSegmentForm } from "@/features/contacts/components/useContactSegmentForm";
import type { ContactSegment, SegmentCriterion, SegmentOperator } from "@/features/contacts/types";

const OPERATOR_OPTIONS: { value: SegmentOperator; label: string }[] = [
  { value: "equals", label: "est égal à" },
  { value: "contains", label: "contient" },
  { value: "is_set", label: "est renseigné" },
  { value: "is_not_set", label: "n'est pas renseigné" },
];

export function ContactSegmentForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: ContactSegment | null;
  onSubmit: (name: string, criteria: SegmentCriterion[]) => Promise<void>;
  onCancel?: () => void;
}) {
  const { name, setName, criteria, addCriterion, removeCriterion, setCriterionOperator, updateCriterion, isSubmitting, error, handleSubmit } =
    useContactSegmentForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Nom du segment" required value={name} onChange={(event) => setName(event.target.value)} />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          Critères <span className="text-muted">(tous doivent correspondre)</span>
        </p>
        {criteria.map((criterion, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2">
            <Field
              label="Champ"
              placeholder="email, name, phone…"
              value={criterion.field}
              onChange={(event) => updateCriterion(index, { field: event.target.value })}
              hint={index === 0 ? "nom, email, phone, ou un attribut personnalisé" : undefined}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`segment-operator-${index}`} className="text-sm font-medium text-foreground">
                Condition
              </label>
              <select
                id={`segment-operator-${index}`}
                value={criterion.operator}
                onChange={(event) => setCriterionOperator(index, event.target.value as SegmentOperator)}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
              >
                {OPERATOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {criterion.operator !== "is_set" && criterion.operator !== "is_not_set" && (
              <Field
                label="Valeur"
                value={criterion.value ?? ""}
                onChange={(event) => updateCriterion(index, { value: event.target.value })}
              />
            )}

            {criteria.length > 1 && (
              <Button variant="ghost" type="button" onClick={() => removeCriterion(index)}>
                Retirer
              </Button>
            )}
          </div>
        ))}

        <div>
          <Button variant="secondary" type="button" onClick={addCriterion}>
            Ajouter un critère
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Créer le segment"}
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
