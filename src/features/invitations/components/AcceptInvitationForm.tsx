"use client";

import { Alert, Badge, Button, Field, Spinner } from "@/components/ui";
import { useAcceptInvitation } from "@/features/invitations/components/useAcceptInvitation";

export function AcceptInvitationForm({ token }: { token: string }) {
  const {
    previewState,
    isAuthenticated,
    name,
    setName,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    isSubmitting,
    submitError,
    handleSubmit,
  } = useAcceptInvitation(token);

  if (previewState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Vérification de l&apos;invitation…
      </div>
    );
  }

  if (previewState.status === "error") {
    return <Alert variant="error">{previewState.error.message}</Alert>;
  }

  const { preview } = previewState;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted">
          Invitation à rejoindre <strong className="text-foreground">{preview.workspace_name}</strong>
          {preview.invited_by ? ` par ${preview.invited_by}` : ""}.
        </p>
        <div className="flex items-center gap-2">
          <Badge tone="primary">{preview.role_label}</Badge>
          <span className="text-sm text-muted">{preview.email}</span>
        </div>
      </div>

      {submitError && submitError.code !== "login_required" && <Alert variant="error">{submitError.message}</Alert>}
      {submitError?.code === "login_required" && (
        <Alert variant="info">
          Un compte existe déjà pour {preview.email}. Connectez-vous, puis revenez sur ce lien pour l&apos;accepter.
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {!isAuthenticated && preview.account_exists === false && (
          <>
            <Field
              label="Nom"
              name="name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Field
              label="Choisissez un mot de passe"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Field
              label="Confirmer le mot de passe"
              type="password"
              name="password_confirmation"
              autoComplete="new-password"
              required
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
            />
          </>
        )}

        <Button type="submit" isLoading={isSubmitting}>
          Accepter l&apos;invitation
        </Button>
      </form>
    </div>
  );
}
