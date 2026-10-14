import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";

export function useHelpCenterCategoryForm(submit: (name: string) => Promise<void>, initial: { name: string } | null) {
  const [name, setName] = useState(initial?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit(name);
      if (!initial) {
        setName("");
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, isSubmitting, error, handleSubmit };
}
