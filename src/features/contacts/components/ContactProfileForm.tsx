"use client";

import { Button, Field } from "@/components/ui";
import { useContactProfileForm } from "@/features/contacts/components/useContactProfileForm";
import type { Contact, ContactWriteInput } from "@/features/contacts/types";

export function ContactProfileForm({
  contact,
  update,
}: {
  contact: Contact;
  update: (input: Partial<ContactWriteInput>) => Promise<void>;
}) {
  const { name, setName, email, setEmail, phone, setPhone, isSubmitting, handleSubmit } = useContactProfileForm(contact, update);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Field label="Nom" value={name} onChange={(event) => setName(event.target.value)} />
      <Field label="E-mail" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      <Field label="Téléphone" value={phone} onChange={(event) => setPhone(event.target.value)} />
      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
