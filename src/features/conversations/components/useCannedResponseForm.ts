import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";

export function useCannedResponseForm(
  submit: (title: string, body: string) => Promise<void>,
  initial: { title: string; body: string } | null,
) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit(title, body);
      if (!initial) {
        setTitle("");
        setBody("");
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { title, setTitle, body, setBody, isSubmitting, error, handleSubmit };
}
