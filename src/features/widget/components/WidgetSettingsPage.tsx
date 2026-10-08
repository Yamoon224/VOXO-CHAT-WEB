"use client";

import { Alert, Card, Spinner } from "@/components/ui";
import { useWidgetSettingsPage } from "@/features/widget/components/useWidgetSettingsPage";
import { WidgetSettingsForm } from "@/features/widget/components/WidgetSettingsForm";
import { ScriptPanel } from "@/features/widget/components/ScriptPanel";

/** Écran `/settings/widget` : apparence, horaires et script d'intégration du widget. */
export function WidgetSettingsPage() {
  const { loadState, settings, script, actionError, update } = useWidgetSettingsPage();

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des réglages du widget…
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
        <h2 className="mb-4 text-sm font-semibold text-foreground">Apparence et horaires</h2>
        <WidgetSettingsForm settings={settings} update={update} />
      </Card>

      {script && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-foreground">Script d&apos;intégration</h2>
          <ScriptPanel script={script} />
        </Card>
      )}
    </div>
  );
}
