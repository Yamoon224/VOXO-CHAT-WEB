import { useState, type FormEvent } from "react";
import * as profileApi from "@/features/profile/api";
import { useSession } from "@/lib/auth/session-context";
import { ApiError } from "@/lib/api/errors";
import type { Locale } from "@/features/auth/types";

export function useProfileForm() {
  const { session, refresh } = useSession();
  const [name, setName] = useState(session?.user.name ?? "");
  const [locale, setLocale] = useState<Locale>(session?.user.locale ?? "fr");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSaved(false);

    try {
      await profileApi.updateProfile({ name, locale });
      await refresh();
      setIsSaved(true);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { name, setName, locale, setLocale, isSubmitting, isSaved, error, handleSubmit };
}
