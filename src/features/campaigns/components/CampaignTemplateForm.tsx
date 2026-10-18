"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useCampaignTemplateForm } from "@/features/campaigns/components/useCampaignTemplateForm";
import { CAMPAIGN_CHANNEL_LABELS, type CampaignChannel, type CampaignTemplate } from "@/features/campaigns/types";
import type { CampaignTemplatePayload } from "@/features/campaigns/api";

const CHANNEL_OPTIONS = Object.keys(CAMPAIGN_CHANNEL_LABELS) as CampaignChannel[];

export function CampaignTemplateForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: CampaignTemplate | null;
  onSubmit: (payload: CampaignTemplatePayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const { name, setName, channel, setChannel, subject, setSubject, body, setBody, isSubmitting, error, handleSubmit } =
    useCampaignTemplateForm(onSubmit, initial ?? null);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Nom du modèle" required value={name} onChange={(event) => setName(event.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign-template-channel" className="text-sm font-medium text-foreground">
          Canal
        </label>
        <select
          id="campaign-template-channel"
          value={channel}
          onChange={(event) => setChannel(event.target.value as CampaignChannel)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          {CHANNEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {CAMPAIGN_CHANNEL_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      {channel === "email" && (
        <Field label="Objet" required value={subject} onChange={(event) => setSubject(event.target.value)} />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign-template-body" className="text-sm font-medium text-foreground">
          Corps
        </label>
        <textarea
          id="campaign-template-body"
          required
          rows={5}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
        <p className="text-xs text-muted">{"Variables disponibles : {{name}}, {{email}}"}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Créer le modèle"}
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
