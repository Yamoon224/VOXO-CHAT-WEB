"use client";

import { Alert, Card, Spinner } from "@/components/ui";
import { useChannelEmailSettingsPage } from "@/features/channels/components/useChannelEmailSettingsPage";
import { ChannelEmailSettingsForm } from "@/features/channels/components/ChannelEmailSettingsForm";

/** Écran `/settings/channels` : canal e-mail (boîte partagée, domaine d'envoi). Le formulaire de contact n'a pas de réglages. */
export function ChannelEmailSettingsPage() {
  const { loadState, settings, actionError, update } = useChannelEmailSettingsPage();

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des réglages du canal e-mail…
      </div>
    );
  }

  if (loadState.status === "error" || settings === null) {
    return <Alert variant="error">{loadState.status === "error" ? loadState.error.message : "Réglages introuvables."}</Alert>;
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">E-mail</h2>
        <ChannelEmailSettingsForm settings={settings} update={update} />
      </Card>
    </div>
  );
}
