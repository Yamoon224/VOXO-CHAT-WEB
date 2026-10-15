"use client";

import { Alert, Button, Card, Field } from "@/components/ui";
import { useChannelConnectionForm } from "@/features/channels/components/useChannelConnectionForm";
import {
  CHANNELS_WITH_META_HANDSHAKE,
  CHANNELS_WITH_SECRET_TOKEN,
  CHANNEL_CREDENTIAL_FIELDS,
  CHANNEL_LABELS,
  type ChannelConnection,
  type MessagingChannel,
} from "@/features/channels/types";

export function ChannelConnectionCard({
  channel,
  connection,
  update,
}: {
  channel: MessagingChannel;
  connection: ChannelConnection;
  update: (channel: MessagingChannel, payload: { enabled?: boolean; credentials?: Record<string, string> }) => Promise<void>;
}) {
  const { enabled, setEnabled, fields, setField, isFieldConfigured, isSubmitting, error, handleSubmit } = useChannelConnectionForm(
    channel,
    connection,
    update,
  );

  return (
    <Card>
      <h2 className="mb-4 text-sm font-semibold text-foreground">{CHANNEL_LABELS[channel]}</h2>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {error && <Alert variant="error">{error.message}</Alert>}

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
          Canal {CHANNEL_LABELS[channel]} activé
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          {CHANNEL_CREDENTIAL_FIELDS[channel].map(({ key, label }) => (
            <Field
              key={key}
              label={label}
              type="password"
              value={fields[key] ?? ""}
              onChange={(event) => setField(key, event.target.value)}
              placeholder={isFieldConfigured(key) ? "•••• (déjà enregistré)" : "Non renseigné"}
              hint={isFieldConfigured(key) ? "Déjà enregistré — ne retaper que pour le changer." : undefined}
            />
          ))}
        </div>

        {CHANNELS_WITH_META_HANDSHAKE.has(channel) && (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted">
            <p className="font-medium text-foreground">Jeton de vérification du webhook</p>
            <p className="mt-1">
              À coller dans la console Meta lors de la configuration du webhook (champ « Verify Token ») :
            </p>
            <code className="mt-1 block break-all rounded bg-background px-2 py-1 text-xs">{connection.credentials.verify_token}</code>
          </div>
        )}

        {CHANNELS_WITH_SECRET_TOKEN.has(channel) && (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted">
            <p className="font-medium text-foreground">Jeton secret du webhook</p>
            <p className="mt-1">À fournir comme <code>secret_token</code> lors de l&apos;appel <code>setWebhook</code> du bot :</p>
            <code className="mt-1 block break-all rounded bg-background px-2 py-1 text-xs">{connection.credentials.secret_token}</code>
          </div>
        )}

        <div>
          <Button type="submit" isLoading={isSubmitting}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Card>
  );
}
