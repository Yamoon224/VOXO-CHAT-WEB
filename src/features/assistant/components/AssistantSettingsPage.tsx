"use client";

import { Alert, Card, Spinner } from "@/components/ui";
import { useAssistantSettingsPage } from "@/features/assistant/components/useAssistantSettingsPage";
import { AssistantSettingsForm } from "@/features/assistant/components/AssistantSettingsForm";
import { SandboxPanel } from "@/features/assistant/components/SandboxPanel";

/** Écran `/settings/assistant` : réglages de l'agent IA et bac à sable. */
export function AssistantSettingsPage() {
  const { loadState, settings, actionError, update, sandboxReply, sandboxError, isTesting, testSandbox } =
    useAssistantSettingsPage();

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des réglages de l&apos;agent IA…
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
        <h2 className="mb-4 text-sm font-semibold text-foreground">Réglages</h2>
        <AssistantSettingsForm settings={settings} update={update} />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-foreground">Bac à sable</h2>
        <SandboxPanel reply={sandboxReply} error={sandboxError} isTesting={isTesting} onTest={testSandbox} />
      </Card>
    </div>
  );
}
