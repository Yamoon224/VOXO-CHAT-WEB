import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import { CHANNEL_CREDENTIAL_FIELDS, type ChannelConnection, type MessagingChannel } from "@/features/channels/types";

export function useChannelConnectionForm(
  channel: MessagingChannel,
  connection: ChannelConnection,
  update: (channel: MessagingChannel, payload: { enabled?: boolean; credentials?: Record<string, string> }) => Promise<void>,
) {
  const [enabled, setEnabled] = useState(connection.enabled);
  // Les identifiants relus sont masqués (voir `ChannelConnectionResource`) :
  // les champs démarrent vides, on ne resoumet que ce que l'agent retape.
  const [fields, setFields] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function setField(key: string, value: string) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function isFieldConfigured(key: string): boolean {
    return Boolean(connection.credentials[key]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const credentials = Object.fromEntries(
      CHANNEL_CREDENTIAL_FIELDS[channel]
        .map(({ key }) => [key, (fields[key] ?? "").trim()])
        .filter(([, value]) => value !== ""),
    );

    try {
      await update(channel, { enabled, ...(Object.keys(credentials).length > 0 ? { credentials } : {}) });
      setFields({});
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { enabled, setEnabled, fields, setField, isFieldConfigured, isSubmitting, error, handleSubmit };
}
