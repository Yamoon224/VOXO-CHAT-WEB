"use client";

import Link from "next/link";
import { Alert, Button, Field } from "@/components/ui";
import { useRegisterForm } from "@/features/auth/components/useRegisterForm";

export function RegisterForm() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    workspaceName,
    setWorkspaceName,
    isSubmitting,
    error,
    handleSubmit,
  } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && Object.keys(error.fieldErrors).length === 0 && <Alert variant="error">{error.message}</Alert>}

      <Field
        label="Nom"
        name="name"
        autoComplete="name"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={error?.fieldError("name")}
      />
      <Field
        label="Adresse e-mail"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={error?.fieldError("email")}
      />
      <Field
        label="Mot de passe"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={error?.fieldError("password")}
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
      <Field
        label="Nom de votre espace de travail"
        name="workspace_name"
        required
        hint="Le nom de votre entreprise ou de votre équipe."
        value={workspaceName}
        onChange={(event) => setWorkspaceName(event.target.value)}
        error={error?.fieldError("workspace_name")}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Créer mon compte
      </Button>

      <p className="text-center text-sm text-muted">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
