import { useCallback, useEffect, useState } from "react";
import * as statusPageApi from "@/features/status-page/api";
import { ApiError } from "@/lib/api/errors";
import type { StatusMaintenance } from "@/features/status-page/types";
import type { StatusMaintenancePayload } from "@/features/status-page/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useStatusMaintenancesPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [maintenances, setMaintenances] = useState<StatusMaintenance[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await statusPageApi.listStatusMaintenances();
      setMaintenances(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: StatusMaintenancePayload) {
    const { data } = await statusPageApi.createStatusMaintenance(payload);
    setMaintenances((current) => [data, ...current]);
  }

  async function update(id: string, payload: StatusMaintenancePayload) {
    const { data } = await statusPageApi.updateStatusMaintenance(id, payload);
    setMaintenances((current) => current.map((maintenance) => (maintenance.id === id ? data : maintenance)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await statusPageApi.deleteStatusMaintenance(id);
      setMaintenances((current) => current.filter((maintenance) => maintenance.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, maintenances, actionError, create, update, remove };
}
