import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as invitationsApi from "@/features/invitations/api";
import { useSession } from "@/lib/auth/session-context";
import { setToken } from "@/lib/auth/token-store";
import { ApiError } from "@/lib/api/errors";
import type { InvitationPreview } from "@/features/invitations/types";

type PreviewState =
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "ready"; preview: InvitationPreview };

/**
 * Charge l'invitation désignée par le jeton, puis gère son acceptation.
 *
 * Trois issues possibles côté serveur : la session en cours bascule sur
 * l'espace (compte déjà connecté), un compte est créé (nom + mot de passe
 * fournis), ou le serveur répond qu'un compte existe déjà et qu'il faut se
 * connecter d'abord (`login_required`).
 */
export function useAcceptInvitation(token: string) {
  const router = useRouter();
  const { session, refresh } = useSession();
  const [previewState, setPreviewState] = useState<PreviewState>({ status: "loading" });
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    invitationsApi
      .previewInvitation(token)
      .then(({ data }) => {
        if (!cancelled) setPreviewState({ status: "ready", preview: data });
      })
      .catch((caught) => {
        if (!cancelled) {
          setPreviewState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const { data } = await invitationsApi.acceptInvitation(token, {
        name: name || undefined,
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      });

      // Deux issues, un seul geste ensuite : si un compte vient d'être créé,
      // son jeton doit être mémorisé avant de relire la session ; si
      // l'appelant était déjà connecté, son jeton existant a simplement été
      // rebasculé sur l'espace côté serveur.
      if (data.token) {
        setToken(data.token);
      }
      await refresh();

      router.push("/dashboard");
    } catch (caught) {
      setSubmitError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    previewState,
    isAuthenticated: session !== null,
    name,
    setName,
    password,
    setPassword,
    passwordConfirmation,
    setPasswordConfirmation,
    isSubmitting,
    submitError,
    handleSubmit,
  };
}
