import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { AutomationCondition, AutomationScenario, AutomationStatus, AutomationStep, AutomationTriggerType } from "@/features/automations/types";
import type { AutomationScenarioPayload } from "@/features/automations/api";

const EMPTY_CONDITION: AutomationCondition = { field: "message", operator: "contains", value: "" };
const EMPTY_STEP: AutomationStep = { type: "send_message", config: { body: "" } };

export function useAutomationScenarioForm(
  submit: (payload: AutomationScenarioPayload) => Promise<void>,
  initial: AutomationScenario | null,
) {
  const [name, setName] = useState(initial?.name ?? "");
  const [status, setStatus] = useState<AutomationStatus>(initial?.status ?? "draft");
  const [triggerType, setTriggerType] = useState<AutomationTriggerType>(initial?.trigger_type ?? "conversation_opened");
  const [conditions, setConditions] = useState<AutomationCondition[]>(initial?.conditions ?? []);
  const [steps, setSteps] = useState<AutomationStep[]>(initial?.steps ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function addCondition() {
    setConditions((current) => [...current, { ...EMPTY_CONDITION }]);
  }

  function removeCondition(index: number) {
    setConditions((current) => current.filter((_, i) => i !== index));
  }

  function updateCondition(index: number, patch: Partial<AutomationCondition>) {
    setConditions((current) => current.map((condition, i) => (i === index ? { ...condition, ...patch } : condition)));
  }

  function addStep() {
    setSteps((current) => [...current, { ...EMPTY_STEP, config: { ...EMPTY_STEP.config } }]);
  }

  function removeStep(index: number) {
    setSteps((current) => current.filter((_, i) => i !== index));
  }

  function setStepType(index: number, type: AutomationStep["type"]) {
    setSteps((current) => current.map((step, i) => (i === index ? { type, config: {} } : step)));
  }

  function updateStepConfig(index: number, patch: AutomationStep["config"]) {
    setSteps((current) => current.map((step, i) => (i === index ? { ...step, config: { ...step.config, ...patch } } : step)));
  }

  function moveStep(index: number, direction: -1 | 1) {
    const target = index + direction;
    setSteps((current) => {
      if (target < 0 || target >= current.length) {
        return current;
      }
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({ name, status, trigger_type: triggerType, conditions, steps });
      if (!initial) {
        setName("");
        setStatus("draft");
        setTriggerType("conversation_opened");
        setConditions([]);
        setSteps([]);
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
