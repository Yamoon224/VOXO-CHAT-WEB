import { useCallback, useEffect, useState } from "react";
import * as analyticsApi from "@/features/analytics/api";
import { ApiError } from "@/lib/api/errors";
import type { AnalyticsOverview } from "@/features/analytics/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Vue d'ensemble de l'activité de l'espace courant, sur une période ajustable. */
export function useAnalyticsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const load = useCallback(async (nextFrom?: string, nextTo?: string) => {
    setLoadState({ status: "loading" });
    try {
      const { data } = await analyticsApi.getOverview(nextFrom || undefined, nextTo || undefined);
      setOverview(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
    // Chargement initial uniquement : `applyRange` recharge explicitement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyRange(nextFrom: string, nextTo: string) {
    setFrom(nextFrom);
    setTo(nextTo);
    void load(nextFrom, nextTo);
  }

  return { loadState, overview, from, to, applyRange };
}
