import { useCallback, useEffect, useState } from "react";
import * as analyticsApi from "@/features/analytics/api";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { AnalyticsOverview } from "@/features/analytics/types";
import type { Member } from "@/features/team/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Vue d'ensemble de l'activité de l'espace courant, sur une période ajustable. */
export function useAnalyticsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<ApiError | null>(null);

  const load = useCallback(async (nextFrom?: string, nextTo?: string) => {
    setLoadState({ status: "loading" });
    try {
      const [{ data }, membersResponse] = await Promise.all([
        analyticsApi.getOverview(nextFrom || undefined, nextTo || undefined),
        teamApi.listMembers(),
      ]);
      setOverview(data);
      setMembers(membersResponse.data);
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

  async function exportCsv() {
    setIsExporting(true);
    setExportError(null);
    try {
      await analyticsApi.exportAnalytics(from || undefined, to || undefined);
    } catch (caught) {
      setExportError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsExporting(false);
    }
  }

  return { loadState, overview, members, from, to, applyRange, isExporting, exportError, exportCsv };
}
