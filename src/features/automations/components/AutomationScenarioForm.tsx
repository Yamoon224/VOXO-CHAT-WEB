"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useAutomationScenarioForm } from "@/features/automations/components/useAutomationScenarioForm";
import type {
  AutomationActionType,
  AutomationConditionField,
  AutomationConditionOperator,
  AutomationScenario,
  AutomationTriggerType,
} from "@/features/automations/types";
import type { AutomationScenarioPayload } from "@/features/automations/api";
import type { Member } from "@/features/team/types";

const TRIGGER_OPTIONS: { value: AutomationTriggerType; label: string }[] = [
  { value: "conversation_opened", label: "Conversation ouverte" },
  { value: "message_received", label: "Message reçu" },
];

const FIELD_OPTIONS: { value: AutomationConditionField; label: string }[] = [
  { value: "channel", label: "Canal (origine)" },
  { value: "message", label: "Message" },
];

const OPERATOR_OPTIONS: { value: AutomationConditionOperator; label: string }[] = [
  { value: "equals", label: "est égal à" },
  { value: "contains", label: "contient" },
];

const ACTION_OPTIONS: { value: AutomationActionType; label: string }[] = [
  { value: "send_message", label: "Envoyer un message" },
  { value: "ask_question", label: "Poser une question et attendre la réponse" },
  { value: "assign_user", label: "Affecter à un agent" },
  { value: "set_contact_attribute", label: "Définir un attribut du contact" },
];

export function AutomationScenarioForm({
  initial,
  members,
  onSubmit,
  onCancel,
}: {
  initial?: AutomationScenario | null;
  members: Member[];
  onSubmit: (payload: AutomationScenarioPayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const {
    name,
    setName,
    status,
    setStatus,
    triggerType,
    setTriggerType,
    conditions,
    addCondition,
    removeCondition,
    updateCondition,
    steps,
    addStep,
    removeStep,
    setStepType,
    updateStepConfig,
    moveStep,
    isSubmitting,
    error,
    handleSubmit,
  } = useAutomationScenarioForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom du scénario" required value={name} onChange={(event) => setName(event.target.value)} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="automation-trigger-type" className="text-sm font-medium text-foreground">
            Déclencheur
          </label>
          <select
            id="automation-trigger-type"
            value={triggerType}
            onChange={(event) => setTriggerType(event.target.value as AutomationTriggerType)}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            {TRIGGER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={status === "published"} onChange={(event) => setStatus(event.target.checked ? "published" : "draft")} />
        Publié (sinon brouillon — jamais évalué sur une vraie conversation)
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          Critères <span className="text-muted">(tous doivent correspondre ; aucun = s&apos;applique toujours)</span>
        </p>
        {conditions.map((condition, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={`automation-condition-field-${index}`} className="text-sm font-medium text-foreground">
                Signal
              </label>
              <select
                id={`automation-condition-field-${index}`}
                value={condition.field}
                onChange={(event) => updateCondition(index, { field: event.target.value as AutomationConditionField })}
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
              <label htmlFor={`automation-condition-operator-${index}`} className="text-sm font-medium text-foreground">
                Condition
              </label>
              <select
                id={`automation-condition-operator-${index}`}
                value={condition.operator}
                onChange={(event) => updateCondition(index, { operator: event.target.value as AutomationConditionOperator })}
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

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Étapes <span className="text-muted">(exécutées dans l&apos;ordre)</span></p>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-md border border-border p-3">
            <div className="flex flex-wrap items-end gap-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`automation-step-type-${index}`} className="text-sm font-medium text-foreground">
                  Action
                </label>
                <select
                  id={`automation-step-type-${index}`}
                  value={step.type}
                  onChange={(event) => setStepType(index, event.target.value as AutomationActionType)}
                  className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
                >
                  {ACTION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" type="button" onClick={() => moveStep(index, -1)} disabled={index === 0}>
                  ↑
                </Button>
                <Button variant="ghost" type="button" onClick={() => moveStep(index, 1)} disabled={index === steps.length - 1}>
                  ↓
                </Button>
                <Button variant="ghost" type="button" onClick={() => removeStep(index)}>
                  Retirer
                </Button>
              </div>
            </div>

            {(step.type === "send_message" || step.type === "ask_question") && (
              <Field
                label={step.type === "ask_question" ? "Question" : "Message"}
                value={step.config.body ?? ""}
                onChange={(event) => updateStepConfig(index, { body: event.target.value })}
              />
            )}

            {step.type === "ask_question" && (
              <Field
                label="Attribut du contact à renseigner"
                placeholder="email, téléphone, besoin…"
                value={step.config.attribute_key ?? ""}
                onChange={(event) => updateStepConfig(index, { attribute_key: event.target.value })}
                hint="La prochaine réponse du visiteur est enregistrée sous cette clé sur son profil."
              />
            )}

            {step.type === "assign_user" && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`automation-step-user-${index}`} className="text-sm font-medium text-foreground">
                  Agent
                </label>
                <select
                  id={`automation-step-user-${index}`}
                  value={step.config.user_id ?? ""}
                  onChange={(event) => updateStepConfig(index, { user_id: event.target.value })}
                  className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
                >
                  <option value="">Choisir un agent</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.user.id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {step.type === "set_contact_attribute" && (
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Clé" value={step.config.key ?? ""} onChange={(event) => updateStepConfig(index, { key: event.target.value })} />
                <Field label="Valeur" value={step.config.value ?? ""} onChange={(event) => updateStepConfig(index, { value: event.target.value })} />
              </div>
            )}
          </div>
        ))}

        <div>
          <Button variant="secondary" type="button" onClick={addStep}>
            Ajouter une étape
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Créer le scénario"}
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
