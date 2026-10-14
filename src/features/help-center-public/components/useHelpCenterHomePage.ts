import { useCallback, useEffect, useState } from "react";
import * as helpCenterPublicApi from "@/features/help-center-public/api";
import { ApiError } from "@/lib/api/errors";
import type { PublicHelpCenterArticle, PublicHelpCenterCategory } from "@/features/help-center-public/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useHelpCenterHomePage(workspaceId: string, categoryId?: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [categories, setCategories] = useState<PublicHelpCenterCategory[]>([]);
  const [articles, setArticles] = useState<PublicHelpCenterArticle[]>([]);

  const load = useCallback(async () => {
    try {
      const [categoriesResponse, articlesResponse] = await Promise.all([
        helpCenterPublicApi.listCategories(workspaceId),
        helpCenterPublicApi.listArticles(workspaceId, categoryId),
      ]);
      setCategories(categoriesResponse.data);
      setArticles(articlesResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [workspaceId, categoryId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { loadState, categories, articles };
}
