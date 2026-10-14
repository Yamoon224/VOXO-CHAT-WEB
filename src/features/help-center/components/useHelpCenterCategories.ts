import { useCallback, useEffect, useState } from "react";
import * as helpCenterApi from "@/features/help-center/api";
import { ApiError } from "@/lib/api/errors";
import type { HelpCenterCategory } from "@/features/help-center/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useHelpCenterCategories() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [categories, setCategories] = useState<HelpCenterCategory[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await helpCenterApi.listCategories();
      setCategories(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(name: string) {
    const { data } = await helpCenterApi.createCategory(name, categories.length);
    setCategories((current) => [...current, data]);
  }

  async function update(id: string, name: string, position: number) {
    const { data } = await helpCenterApi.updateCategory(id, name, position);
    setCategories((current) => current.map((category) => (category.id === id ? data : category)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await helpCenterApi.deleteCategory(id);
      setCategories((current) => current.filter((category) => category.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, categories, actionError, create, update, remove };
}
