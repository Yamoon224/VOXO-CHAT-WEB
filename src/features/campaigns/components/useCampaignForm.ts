import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { Campaign, CampaignChannel } from "@/features/campaigns/types";
import type { CampaignPayload } from "@/features/campaigns/api";

export function useCampaignForm(submit: (payload: CampaignPayload) => Promise<void>, initial: Campaign | null) {
  const [name, setName] = useState(initial?.name ?? "");
  const [channel, setChannel] = useState<CampaignChannel>(initial?.channel ?? "email");
  const [segmentId, setSegmentId] = useState(initial?.segment_id ?? "");
  const [templateId, setTemplateId] = useState(initial?.template_id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({ name, channel, segment_id: segmentId, template_id: templateId });
      if (!initial) {
        setName("");
        setChannel("email");
        setSegmentId("");
        setTemplateId("");
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, channel, setChannel, segmentId, setSegmentId, templateId, setTemplateId, isSubmitting, error, handleSubmit };
}
