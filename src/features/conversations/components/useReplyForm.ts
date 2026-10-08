import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { MessageVisibility } from "@/features/conversations/types";

export function useReplyForm(reply: (body: string, visibility: MessageVisibility) => Promise<void>) {
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<MessageVisibility>("public");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await reply(body, visibility);
      setBody("");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { body, setBody, visibility, setVisibility, isSubmitting, error, handleSubmit };
}
