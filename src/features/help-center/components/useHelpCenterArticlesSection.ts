import { useCallback, useEffect, useState } from "react";
import * as helpCenterApi from "@/features/help-center/api";
import { ApiError } from "@/lib/api/errors";
import type { ArticleStatus, HelpCenterArticle } from "@/features/help-center/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useHelpCenterArticlesSection() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [articles, setArticles] = useState<HelpCenterArticle[]>([]);
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "">("");
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async (status: ArticleStatus | "") => {
    try {
      const { data } = await helpCenterApi.listArticles({ status });
      setArticles(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load(statusFilter);
  }, [load, statusFilter]);

  async function remove(id: string) {
    setActionError(null);
    try {
      await helpCenterApi.deleteArticle(id);
      setArticles((current) => current.filter((article) => article.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, articles, statusFilter, setStatusFilter, actionError, remove };
}
