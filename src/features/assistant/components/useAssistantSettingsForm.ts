import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { AssistantSettings } from "@/features/assistant/types";

export function useAssistantSettingsForm(settings: AssistantSettings, update: (payload: Partial<AssistantSettings>) => Promise<void>) {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [toneInstructions, setToneInstructions] = useState(settings.tone_instructions ?? "");
  const [confidenceThreshold, setConfidenceThreshold] = useState(settings.confidence_threshold);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await update({ enabled, tone_instructions: toneInstructions || null, confidence_threshold: confidenceThreshold });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    enabled,
    setEnabled,
    toneInstructions,
    setToneInstructions,
    confidenceThreshold,
    setConfidenceThreshold,
    isSubmitting,
    error,
    handleSubmit,
  };
}
