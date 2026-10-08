import { useState, type FormEvent } from "react";
import * as profileApi from "@/features/profile/api";
import { ApiError } from "@/lib/api/errors";

export function usePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSaved(false);

    try {
      await profileApi.updatePassword({
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setIsSaved(true);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    currentPassword,
    setCurrentPassword,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    isSubmitting,
    isSaved,
    error,
    handleSubmit,
  };
}
