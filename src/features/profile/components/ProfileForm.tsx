"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useProfileForm } from "@/features/profile/components/useProfileForm";

export function ProfileForm() {
  const { name, setName, locale, setLocale, isSubmitting, isSaved, error, handleSubmit } = useProfileForm();

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}
      {isSaved && <Alert variant="success">Profil mis à jour.</Alert>}

      <Field label="Nom" name="name" required value={name} onChange={(event) => setName(event.target.value)} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="locale" className="text-sm font-medium text-foreground">
          Langue
        </label>
        <select
          id="locale"
          value={locale}
          onChange={(event) => setLocale(event.target.value as "fr" | "en")}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        Enregistrer
      </Button>
    </form>
  );
}
