"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useRoutingRuleForm } from "@/features/conversations/components/useRoutingRuleForm";
import type { RoutingActionType, RoutingConditionField, RoutingConditionOperator, RoutingRule } from "@/features/conversations/types";
import type { RoutingRulePayload } from "@/features/conversations/api";
import type { Member } from "@/features/team/types";

const FIELD_OPTIONS: { value: RoutingConditionField; label: string }[] = [
  { value: "channel", label: "Canal (origine)" },
  { value: "message", label: "Premier message (intention)" },
];

const OPERATOR_OPTIONS: { value: RoutingConditionOperator; label: string }[] = [
  { value: "equals", label: "est égal à" },
  { value: "contains", label: "contient" },
];

const ACTION_OPTIONS: { value: RoutingActionType; label: string }[] = [
  { value: "assign_user", label: "Affecter à un agent" },
  { value: "round_robin", label: "Répartir au tourniquet" },
];

export function RoutingRuleForm({
  initial,
  members,
  onSubmit,
  onCancel,
}: {
  initial?: RoutingRule | null;
  members: Member[];
  onSubmit: (payload: RoutingRulePayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    name,
    setName,
    isActive,
    setIsActive,
    actionType,
    setActionType,
    assigneeUserIds,
    toggleAssignee,
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    isSubmitting,
    error,
    handleSubmit,
  } = useRoutingRuleForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Nom de la règle" required value={name} onChange={(event) => setName(event.target.value)} />

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
        Règle active
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          Critères <span className="text-muted">(tous doivent correspondre ; aucun = s&apos;applique toujours)</span>
        </p>
        {conditions.map((condition, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`routing-condition-field-${index}`} className="text-sm font-medium text-foreground">
                Signal
              </label>
              <select
                id={`routing-condition-field-${index}`}
                value={condition.field}
                onChange={(event) => updateCondition(index, { field: event.target.value as RoutingConditionField })}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
              >
                {FIELD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor={`routing-condition-operator-${index}`} className="text-sm font-medium text-foreground">
                Condition
              </label>
              <select
                id={`routing-condition-operator-${index}`}
                value={condition.operator}
                onChange={(event) => updateCondition(index, { operator: event.target.value as RoutingConditionOperator })}
                className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
              >
                {OPERATOR_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Field label="Valeur" value={condition.value} onChange={(event) => updateCondition(index, { value: event.target.value })} />

            <Button variant="ghost" type="button" onClick={() => removeCondition(index)}>
              Retirer
            </Button>
          </div>
        ))}

        <div>
          <Button variant="secondary" type="button" onClick={addCondition}>
            Ajouter un critère
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="routing-action-type" className="text-sm font-medium text-foreground">
          Action
        </label>
        <select
          id="routing-action-type"
          value={actionType}
          onChange={(event) => setActionType(event.target.value as RoutingActionType)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          {ACTION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          {actionType === "round_robin" ? "Agents (répartis dans l'ordre ci-dessous)" : "Agent (le premier sélectionné est retenu)"}
        </p>
        <div className="flex flex-col gap-1">
          {members.map((member) => (
            <label key={member.id} className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={assigneeUserIds.includes(member.user.id)}
                onChange={() => toggleAssignee(member.user.id)}
              />
              {member.user.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Créer la règle"}
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
