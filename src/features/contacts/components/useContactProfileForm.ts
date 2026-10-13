import { useState, type FormEvent } from "react";
import type { Contact, ContactWriteInput } from "@/features/contacts/types";

export function useContactProfileForm(contact: Contact, update: (input: Partial<ContactWriteInput>) => Promise<void>) {
  const [name, setName] = useState(contact.name ?? "");
  const [email, setEmail] = useState(contact.email ?? "");
  const [phone, setPhone] = useState(contact.phone ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await update({
        name: name.trim() === "" ? null : name,
        email: email.trim() === "" ? null : email,
        phone: phone.trim() === "" ? null : phone,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, email, setEmail, phone, setPhone, isSubmitting, handleSubmit };
}
