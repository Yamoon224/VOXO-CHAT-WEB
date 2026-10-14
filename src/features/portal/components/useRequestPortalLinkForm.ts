import { useState, type FormEvent } from "react";
import * as portalApi from "@/features/portal/api";
import { ApiError } from "@/lib/api/errors";

export function useRequestPortalLinkForm(workspaceId: string) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await portalApi.requestPortalLink(workspaceId, email);
      // Même écran de confirmation que l'adresse ait des tickets ou non.
      setIsSubmitted(true);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { email, setEmail, isSubmitting, isSubmitted, error, handleSubmit };
}
