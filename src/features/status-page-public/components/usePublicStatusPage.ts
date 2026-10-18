import { useCallback, useEffect, useState } from "react";
import * as statusPagePublicApi from "@/features/status-page-public/api";
import { ApiError } from "@/lib/api/errors";
import type { PublicStatusOverview } from "@/features/status-page-public/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };
type SubscribeState = { status: "idle" } | { status: "submitting" } | { status: "done" } | { status: "error"; error: ApiError };

export function usePublicStatusPage(workspaceId: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [overview, setOverview] = useState<PublicStatusOverview | null>(null);
  const [subscribeState, setSubscribeState] = useState<SubscribeState>({ status: "idle" });

  const load = useCallback(async () => {
    try {
      const { data } = await statusPagePublicApi.getOverview(workspaceId);
      setOverview(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [workspaceId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function subscribe(email: string) {
    setSubscribeState({ status: "submitting" });
    try {
      await statusPagePublicApi.subscribe(workspaceId, email);
      setSubscribeState({ status: "done" });
    } catch (caught) {
      setSubscribeState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }

  return { loadState, overview, subscribeState, subscribe };
}
