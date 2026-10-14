"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useRequestPortalLinkForm } from "@/features/portal/components/useRequestPortalLinkForm";

export function RequestPortalLinkForm({ workspaceId }: { workspaceId: string }) {
  const { email, setEmail, isSubmitting, isSubmitted, error, handleSubmit } = useRequestPortalLinkForm(workspaceId);

  if (isSubmitted) {
    return (
      <Alert variant="success">Si cette adresse a déjà une demande en cours, un lien de suivi vient de lui être envoyé.</Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Adresse e-mail" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />

      <Button type="submit" variant="secondary" isLoading={isSubmitting}>
        Retrouver mon lien de suivi
      </Button>
    </form>
  );
}
