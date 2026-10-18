import { useCallback, useEffect, useState } from "react";
import * as statusPageApi from "@/features/status-page/api";
import { ApiError } from "@/lib/api/errors";
import type { StatusSubscriber } from "@/features/status-page/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useStatusSubscribersPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [subscribers, setSubscribers] = useState<StatusSubscriber[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await statusPageApi.listStatusSubscribers();
      setSubscribers(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    setActionError(null);
    try {
      await statusPageApi.deleteStatusSubscriber(id);
      setSubscribers((current) => current.filter((subscriber) => subscriber.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, subscribers, actionError, remove };
}
