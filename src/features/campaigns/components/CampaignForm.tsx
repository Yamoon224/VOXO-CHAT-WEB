"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useCampaignForm } from "@/features/campaigns/components/useCampaignForm";
import { CAMPAIGN_CHANNEL_LABELS, type Campaign, type CampaignChannel, type CampaignTemplate } from "@/features/campaigns/types";
import type { CampaignPayload } from "@/features/campaigns/api";
import type { ContactSegment } from "@/features/contacts/types";

const CHANNEL_OPTIONS = Object.keys(CAMPAIGN_CHANNEL_LABELS) as CampaignChannel[];

export function CampaignForm({
  initial,
  segments,
  templates,
  onSubmit,
  onCancel,
}: {
  initial?: Campaign | null;
  segments: ContactSegment[];
  templates: CampaignTemplate[];
  onSubmit: (payload: CampaignPayload) => Promise<void>;
  onCancel?: () => void;
}) {
  const { name, setName, channel, setChannel, segmentId, setSegmentId, templateId, setTemplateId, isSubmitting, error, handleSubmit } =
    useCampaignForm(onSubmit, initial ?? null);

  const templatesForChannel = templates.filter((template) => template.channel === channel);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Nom de la campagne" required value={name} onChange={(event) => setName(event.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign-channel" className="text-sm font-medium text-foreground">
          Canal
        </label>
        <select
          id="campaign-channel"
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign-segment" className="text-sm font-medium text-foreground">
          Segment ciblé
        </label>
        <select
          id="campaign-segment"
          required
          value={segmentId}
          onChange={(event) => setSegmentId(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          <option value="" disabled>
            Choisir un segment
          </option>
          {segments.map((segment) => (
            <option key={segment.id} value={segment.id}>
              {segment.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="campaign-template" className="text-sm font-medium text-foreground">
          Modèle
        </label>
        <select
          id="campaign-template"
          required
          value={templateId}
          onChange={(event) => setTemplateId(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          <option value="" disabled>
            Choisir un modèle
          </option>
          {templatesForChannel.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" isLoading={isSubmitting}>
          {initial ? "Enregistrer" : "Créer la campagne"}
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
