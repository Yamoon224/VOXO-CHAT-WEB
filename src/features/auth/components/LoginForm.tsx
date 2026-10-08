"use client";

import Link from "next/link";
import { Alert, Button, Field } from "@/components/ui";
import { useLoginForm } from "@/features/auth/components/useLoginForm";

export function LoginForm() {
  const { email, setEmail, password, setPassword, code, setCode, needsTwoFactor, isSubmitting, error, handleSubmit } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && error.code !== "two_factor_required" && <Alert variant="error">{error.message}</Alert>}

      <Field
        label="Adresse e-mail"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Field
        label="Mot de passe"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      {needsTwoFactor && (
        <Field
          label="Code de vérification"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          hint="Depuis votre application d'authentification."
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
      )}

      <Button type="submit" isLoading={isSubmitting}>
        Se connecter
      </Button>

      <div className="flex items-center justify-between text-sm text-muted">
        <Link href="/forgot-password" className="hover:text-primary">
          Mot de passe oublié ?
        </Link>
        <Link href="/register" className="hover:text-primary">
          Créer un compte
        </Link>
      </div>
    </form>
  );
}
