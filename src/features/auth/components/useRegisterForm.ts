import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/features/auth/api";
import { useSession } from "@/lib/auth/session-context";
import { ApiError } from "@/lib/api/errors";

export function useRegisterForm() {
  const router = useRouter();
  const { applyIssuedSession } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data } = await authApi.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        workspace_name: workspaceName,
      });
      applyIssuedSession(data);
      router.push("/dashboard");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    workspaceName,
    setWorkspaceName,
    isSubmitting,
    error,
    handleSubmit,
  };
}
