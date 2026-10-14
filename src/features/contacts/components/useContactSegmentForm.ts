import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { ContactSegment, SegmentCriterion, SegmentOperator } from "@/features/contacts/types";

const EMPTY_CRITERION: SegmentCriterion = { field: "", operator: "equals", value: "" };

export function useContactSegmentForm(
  submit: (name: string, criteria: SegmentCriterion[]) => Promise<void>,
  initial: ContactSegment | null,
) {
  const [name, setName] = useState(initial?.name ?? "");
  const [criteria, setCriteria] = useState<SegmentCriterion[]>(initial?.criteria ?? [{ ...EMPTY_CRITERION }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function addCriterion() {
    setCriteria((current) => [...current, { ...EMPTY_CRITERION }]);
  }

  function removeCriterion(index: number) {
    setCriteria((current) => current.filter((_, i) => i !== index));
  }

  function updateCriterion(index: number, patch: Partial<SegmentCriterion>) {
    setCriteria((current) => current.map((criterion, i) => (i === index ? { ...criterion, ...patch } : criterion)));
  }

  function setCriterionOperator(index: number, operator: SegmentOperator) {
    const needsValue = operator !== "is_set" && operator !== "is_not_set";
    updateCriterion(index, { operator, value: needsValue ? criteria[index]?.value ?? "" : null });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit(name, criteria);
      if (!initial) {
        setName("");
        setCriteria([{ ...EMPTY_CRITERION }]);
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
    criteria,
    addCriterion,
    removeCriterion,
    updateCriterion,
    setCriterionOperator,
    isSubmitting,
    error,
    handleSubmit,
  };
}
