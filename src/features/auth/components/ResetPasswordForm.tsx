"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useResetPasswordForm } from "@/features/auth/components/useResetPasswordForm";

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const { password, setPassword, passwordConfirmation, setPasswordConfirmation, isSubmitting, error, handleSubmit } =
    useResetPasswordForm(email, token);

  if (!email || !token) {
    return <Alert variant="error">Ce lien de réinitialisation est incomplet. Demandez-en un nouveau.</Alert>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field
        label="Nouveau mot de passe"
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

      <Button type="submit" isLoading={isSubmitting}>
        Réinitialiser le mot de passe
      </Button>
    </form>
  );
}
