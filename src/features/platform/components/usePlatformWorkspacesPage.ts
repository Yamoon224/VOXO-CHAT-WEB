import { useCallback, useEffect, useState } from "react";
import * as platformApi from "@/features/platform/api";
import { ApiError } from "@/lib/api/errors";
import type { PlatformWorkspace } from "@/features/platform/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };
type Meta = { current_page: number; last_page: number; total: number };

/**
 * Console plateforme : tous les espaces de travail, avec palier et usage.
 * Lecture seule.
 *
 * `enabled` vient de `useRequirePlatformAdmin()` : un compte sans ce rôle est
 * redirigé par ce hook, mais la redirection est asynchrone (un effet) — sans
 * cette garde, l'appel réseau partirait quand même avant qu'elle ne s'applique.
 */
export function usePlatformWorkspacesPage(enabled: boolean) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [workspaces, setWorkspaces] = useState<PlatformWorkspace[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);

  const load = useCallback(async (page?: number) => {
    setLoadState({ status: "loading" });
    try {
      const response = await platformApi.listWorkspaces(page);
      setWorkspaces(response.data);
      setMeta(response.meta);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void load();
    }
  }, [enabled, load]);

  function goToPage(page: number) {
    void load(page);
  }

  return { loadState, workspaces, meta, goToPage };
}
