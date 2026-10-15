import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { RoutingActionType, RoutingCondition, RoutingRule } from "@/features/conversations/types";
import type { RoutingRulePayload } from "@/features/conversations/api";

const EMPTY_CONDITION: RoutingCondition = { field: "channel", operator: "equals", value: "" };

export function useRoutingRuleForm(submit: (payload: RoutingRulePayload) => Promise<void>, initial: RoutingRule | null) {
  const [name, setName] = useState(initial?.name ?? "");
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [actionType, setActionType] = useState<RoutingActionType>(initial?.action_type ?? "assign_user");
  const [assigneeUserIds, setAssigneeUserIds] = useState<string[]>(initial?.assignee_user_ids ?? []);
  const [conditions, setConditions] = useState<RoutingCondition[]>(initial?.conditions ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function addCondition() {
    setConditions((current) => [...current, { ...EMPTY_CONDITION }]);
  }

  function removeCondition(index: number) {
    setConditions((current) => current.filter((_, i) => i !== index));
  }

  function updateCondition(index: number, patch: Partial<RoutingCondition>) {
    setConditions((current) => current.map((condition, i) => (i === index ? { ...condition, ...patch } : condition)));
  }

  function toggleAssignee(userId: string) {
    setAssigneeUserIds((current) => (current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({ name, is_active: isActive, action_type: actionType, assignee_user_ids: assigneeUserIds, conditions });
      if (!initial) {
        setName("");
        setIsActive(true);
        setActionType("assign_user");
        setAssigneeUserIds([]);
        setConditions([]);
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
  };
}
