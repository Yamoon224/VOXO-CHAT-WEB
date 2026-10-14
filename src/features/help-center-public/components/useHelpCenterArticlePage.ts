import { useCallback, useEffect, useState } from "react";
import * as helpCenterPublicApi from "@/features/help-center-public/api";
import { ApiError } from "@/lib/api/errors";
import type { PublicHelpCenterArticle } from "@/features/help-center-public/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useHelpCenterArticlePage(workspaceId: string, slug: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [article, setArticle] = useState<PublicHelpCenterArticle | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await helpCenterPublicApi.getArticle(workspaceId, slug);
      setArticle(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [workspaceId, slug]);

  useEffect(() => {
    void load();
  }, [load]);

  return { loadState, article };
}
