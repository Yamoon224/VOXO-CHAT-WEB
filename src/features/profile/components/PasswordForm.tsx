"use client";

import { Alert, Button, Field } from "@/components/ui";
import { usePasswordForm } from "@/features/profile/components/usePasswordForm";

export function PasswordForm() {
  const {
    currentPassword,
    setCurrentPassword,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    isSubmitting,
    isSaved,
    error,
    handleSubmit,
  } = usePasswordForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}
      {isSaved && <Alert variant="success">Mot de passe mis à jour.</Alert>}

      <Field
        label="Mot de passe actuel"
        type="password"
        name="current_password"
        autoComplete="current-password"
        required
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        error={error?.fieldError("current_password")}
      />
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
        label="Confirmer le nouveau mot de passe"
        type="password"
        name="password_confirmation"
        autoComplete="new-password"
        required
        value={passwordConfirmation}
        onChange={(event) => setPasswordConfirmation(event.target.value)}
      />

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Changer le mot de passe
      </Button>
    </form>
  );
}
