import { useEffect, useState, type FormEvent } from "react";
import * as workspaceApi from "@/features/workspace/api";
import { useSession } from "@/lib/auth/session-context";
import { ApiError } from "@/lib/api/errors";
import type { Workspace } from "@/features/workspace/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useWorkspaceSettingsForm() {
  const { refresh } = useSession();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancelled = false;

    workspaceApi
      .currentWorkspace()
      .then(({ data }) => {
        if (cancelled) return;
        setWorkspace(data);
        setName(data.name);
        setLoadState({ status: "ready" });
      })
      .catch((caught) => {
        if (!cancelled) {
          setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setIsSaved(false);

    try {
      const { data } = await workspaceApi.updateWorkspace({ name });
      setWorkspace(data);
      // Le nom de l'espace apparaît dans le sélecteur d'espaces : il doit se
      // mettre à jour partout, pas seulement sur cet écran.
      await refresh();
      setIsSaved(true);
    } catch (caught) {
      setSubmitError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { loadState, workspace, name, setName, isSubmitting, isSaved, submitError, handleSubmit };
}
