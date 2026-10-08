"use client";

import Link from "next/link";
import { Alert, Button, Field } from "@/components/ui";
import { useForgotPasswordForm } from "@/features/auth/components/useForgotPasswordForm";

export function ForgotPasswordForm() {
  const { email, setEmail, isSubmitting, isSubmitted, error, handleSubmit } = useForgotPasswordForm();

  if (isSubmitted) {
    return (
      <Alert variant="success">
        Si un compte existe pour cette adresse, un lien de réinitialisation vient de lui être envoyé.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field
        label="Adresse e-mail"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Envoyer le lien de réinitialisation
      </Button>

      <p className="text-center text-sm text-muted">
        <Link href="/login" className="hover:text-primary">
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
