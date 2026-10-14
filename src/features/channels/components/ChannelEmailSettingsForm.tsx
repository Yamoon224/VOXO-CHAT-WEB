"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useChannelEmailSettingsForm } from "@/features/channels/components/useChannelEmailSettingsForm";
import type { ChannelEmailSettings } from "@/features/channels/types";

export function ChannelEmailSettingsForm({
  settings,
  update,
}: {
  settings: ChannelEmailSettings;
  update: (payload: Partial<ChannelEmailSettings>) => Promise<void>;
}) {
  const {
    enabled,
    setEnabled,
    replyFromEmail,
    setReplyFromEmail,
    replyFromName,
    setReplyFromName,
    isSubmitting,
    error,
    handleSubmit,
  } = useChannelEmailSettingsForm(settings, update);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
        Canal e-mail activé
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Adresse d'envoi"
          type="email"
          value={replyFromEmail}
          onChange={(event) => setReplyFromEmail(event.target.value)}
          placeholder="support@votre-domaine.fr"
          hint="Les réponses des agents partent de cette adresse."
        />

        <Field
          label="Nom d'expéditeur"
          value={replyFromName}
          onChange={(event) => setReplyFromName(event.target.value)}
          placeholder="Support Votre Entreprise"
        />
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
