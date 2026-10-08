"use client";

import { Alert, Button, Field, Spinner } from "@/components/ui";
import { useWorkspaceSettingsForm } from "@/features/workspace/components/useWorkspaceSettingsForm";

export function WorkspaceSettingsForm() {
  const { loadState, workspace, name, setName, isSubmitting, isSaved, submitError, handleSubmit } =
    useWorkspaceSettingsForm();

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement des réglages…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {submitError && <Alert variant="error">{submitError.message}</Alert>}
      {isSaved && <Alert variant="success">Réglages enregistrés.</Alert>}

      <Field
        label="Nom de l'espace de travail"
        name="name"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <p className="text-xs text-muted">Identifiant public : {workspace?.slug}</p>

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Enregistrer
      </Button>
    </form>
  );
}
