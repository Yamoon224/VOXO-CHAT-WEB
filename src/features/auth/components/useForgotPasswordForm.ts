import { useState, type FormEvent } from "react";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

export function useForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await authApi.requestPasswordReset(email);
      // Même écran de confirmation que l'adresse existe ou non : le serveur
      // ne distingue déjà pas les deux cas, l'interface ne doit pas le faire
      // à sa place.
      setIsSubmitted(true);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { email, setEmail, isSubmitting, isSubmitted, error, handleSubmit };
}
