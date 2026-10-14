import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { ChannelEmailSettings } from "@/features/channels/types";

export function useChannelEmailSettingsForm(
  settings: ChannelEmailSettings,
  update: (payload: Partial<ChannelEmailSettings>) => Promise<void>,
) {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [replyFromEmail, setReplyFromEmail] = useState(settings.reply_from_email ?? "");
  const [replyFromName, setReplyFromName] = useState(settings.reply_from_name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await update({
        enabled,
        reply_from_email: replyFromEmail || null,
        reply_from_name: replyFromName || null,
      });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    enabled,
    setEnabled,
    replyFromEmail,
    setReplyFromEmail,
    replyFromName,
    setReplyFromName,
    isSubmitting,
    error,
    handleSubmit,
  };
}
