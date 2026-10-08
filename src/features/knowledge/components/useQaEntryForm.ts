import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";

export function useQaEntryForm(
  submit: (question: string, answer: string) => Promise<void>,
  initial: { question: string; answer: string } | null,
) {
  const [question, setQuestion] = useState(initial?.question ?? "");
  const [answer, setAnswer] = useState(initial?.answer ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submit(question, answer);
      if (!initial) {
        setQuestion("");
        setAnswer("");
      }
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { question, setQuestion, answer, setAnswer, isSubmitting, error, handleSubmit };
}
