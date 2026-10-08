import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as authApi from "@/features/auth/api";
import { useSession } from "@/lib/auth/session-context";
import { ApiError } from "@/lib/api/errors";

type Status = "idle" | "submitting";

/**
 * Logique du formulaire de connexion, y compris la double authentification :
 * un premier envoi sans code peut échouer avec `two_factor_required`, auquel
 * cas le formulaire affiche le champ du code sans perdre l'e-mail et le mot
 * de passe déjà saisis.
 */
export function useLoginForm() {
  const router = useRouter();
  const { applyIssuedSession } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const { data } = await authApi.login({ email, password, code: code || undefined });
      applyIssuedSession(data);
      router.push("/dashboard");
    } catch (caught) {
      if (caught instanceof ApiError) {
        if (caught.code === "two_factor_required") {
          setNeedsTwoFactor(true);
        }
        setError(caught);
      } else {
        setError(ApiError.networkError());
      }
    } finally {
      setStatus("idle");
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    code,
    setCode,
    needsTwoFactor,
    isSubmitting: status === "submitting",
    error,
    handleSubmit,
  };
}
