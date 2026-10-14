import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";

export function usePortalReplyForm(onSubmit: (body: string) => Promise<void>) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (body.trim() === "") {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(body);
      setBody("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { body, setBody, isSubmitting, error, handleSubmit };
}
