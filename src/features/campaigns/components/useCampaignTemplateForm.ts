import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { CampaignChannel, CampaignTemplate } from "@/features/campaigns/types";
import type { CampaignTemplatePayload } from "@/features/campaigns/api";

export function useCampaignTemplateForm(submit: (payload: CampaignTemplatePayload) => Promise<void>, initial: CampaignTemplate | null) {
  const [name, setName] = useState(initial?.name ?? "");
  const [channel, setChannel] = useState<CampaignChannel>(initial?.channel ?? "email");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({ name, channel, subject: channel === "email" ? subject : null, body });
      if (!initial) {
        setName("");
        setChannel("email");
        setSubject("");
        setBody("");
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, channel, setChannel, subject, setSubject, body, setBody, isSubmitting, error, handleSubmit };
}
