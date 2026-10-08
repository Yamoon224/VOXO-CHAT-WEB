import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/features/auth/api";
import { ApiError } from "@/lib/api/errors";

export function useResetPasswordForm(email: string, token: string) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await authApi.resetPassword({ email, token, password, password_confirmation: passwordConfirmation });
      router.push("/login");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { password, setPassword, passwordConfirmation, setPasswordConfirmation, isSubmitting, error, handleSubmit };
}
