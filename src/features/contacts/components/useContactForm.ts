import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { ContactWriteInput } from "@/features/contacts/types";

export function useContactForm(submit: (input: ContactWriteInput) => Promise<void>) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit({
        name: name.trim() === "" ? null : name,
        email: email.trim() === "" ? null : email,
        phone: phone.trim() === "" ? null : phone,
        custom_attributes: null,
      });
      setName("");
      setEmail("");
      setPhone("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, email, setEmail, phone, setPhone, isSubmitting, error, handleSubmit };
}
