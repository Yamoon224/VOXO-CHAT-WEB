import { useCallback, useEffect, useState } from "react";
import * as statusPageApi from "@/features/status-page/api";
import { ApiError } from "@/lib/api/errors";
import type { StatusProbe } from "@/features/status-page/types";
import type { StatusProbePayload } from "@/features/status-page/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useStatusProbesPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [probes, setProbes] = useState<StatusProbe[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await statusPageApi.listStatusProbes();
      setProbes(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: StatusProbePayload) {
    const { data } = await statusPageApi.createStatusProbe(payload);
    setProbes((current) => [data, ...current]);
  }

  async function update(id: string, payload: StatusProbePayload) {
    const { data } = await statusPageApi.updateStatusProbe(id, payload);
    setProbes((current) => current.map((probe) => (probe.id === id ? data : probe)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await statusPageApi.deleteStatusProbe(id);
      setProbes((current) => current.filter((probe) => probe.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, probes, actionError, create, update, remove };
}
