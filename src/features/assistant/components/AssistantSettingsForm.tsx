"use client";

import { Alert, Button } from "@/components/ui";
import { useAssistantSettingsForm } from "@/features/assistant/components/useAssistantSettingsForm";
import type { AssistantSettings } from "@/features/assistant/types";

export function AssistantSettingsForm({
  settings,
  update,
}: {
  settings: AssistantSettings;
  update: (payload: Partial<AssistantSettings>) => Promise<void>;
}) {
  const {
    enabled,
    setEnabled,
    toneInstructions,
    setToneInstructions,
    confidenceThreshold,
    setConfidenceThreshold,
    isSubmitting,
    error,
    handleSubmit,
  } = useAssistantSettingsForm(settings, update);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Agent IA activé
      </label>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tone-instructions" className="text-sm font-medium text-foreground">
          Ton et consignes
        </label>
        <textarea
          id="tone-instructions"
          rows={3}
          value={toneInstructions}
          onChange={(event) => setToneInstructions(event.target.value)}
          placeholder="Ex. Réponds de façon brève et chaleureuse, tutoie le visiteur."
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confidence-threshold" className="text-sm font-medium text-foreground">
          Seuil de confiance avant escalade ({confidenceThreshold.toFixed(2)})
        </label>
        <input
          id="confidence-threshold"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={confidenceThreshold}
          onChange={(event) => setConfidenceThreshold(Number(event.target.value))}
        />
        <p className="text-xs text-muted">
          Sous ce seuil, l&apos;agent passe la main à un coéquipier plutôt que de répondre à l&apos;aveugle.
        </p>
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
