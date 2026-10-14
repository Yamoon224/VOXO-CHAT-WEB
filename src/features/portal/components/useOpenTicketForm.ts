import { useState, type FormEvent } from "react";
import * as portalApi from "@/features/portal/api";
import { ApiError } from "@/lib/api/errors";

export function useOpenTicketForm(workspaceId: string) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await portalApi.openTicket(workspaceId, { email, name: name || undefined, subject, message });
      setIsSubmitted(true);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { email, setEmail, name, setName, subject, setSubject, message, setMessage, isSubmitting, isSubmitted, error, handleSubmit };
}
