"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useContactForm } from "@/features/contacts/components/useContactForm";
import type { ContactWriteInput } from "@/features/contacts/types";

export function ContactForm({ onSubmit }: { onSubmit: (input: ContactWriteInput) => Promise<void> }) {
  const { name, setName, email, setEmail, phone, setPhone, isSubmitting, error, handleSubmit } = useContactForm(onSubmit);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
      {error && (
        <div className="sm:w-full">
          <Alert variant="error">{error.message}</Alert>
        </div>
      )}

      <Field label="Nom" value={name} onChange={(event) => setName(event.target.value)} />
      <Field label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <Field label="Téléphone" value={phone} onChange={(event) => setPhone(event.target.value)} />

      <Button type="submit" isLoading={isSubmitting}>
        Ajouter
      </Button>
    </form>
  );
}
