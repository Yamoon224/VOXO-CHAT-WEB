import { useCallback, useEffect, useState } from "react";
import * as conversationsApi from "@/features/conversations/api";
import { ApiError } from "@/lib/api/errors";
import type { CannedResponse } from "@/features/conversations/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useCannedResponsesPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [responses, setResponses] = useState<CannedResponse[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await conversationsApi.listCannedResponses();
      setResponses(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(title: string, body: string) {
    const { data } = await conversationsApi.createCannedResponse(title, body);
    setResponses((current) => [...current, data]);
  }

  async function update(id: string, title: string, body: string) {
    const { data } = await conversationsApi.updateCannedResponse(id, title, body);
    setResponses((current) => current.map((response) => (response.id === id ? data : response)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await conversationsApi.deleteCannedResponse(id);
      setResponses((current) => current.filter((response) => response.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, responses, actionError, create, update, remove };
}
