import { useCallback, useEffect, useState } from "react";
import * as statusPageApi from "@/features/status-page/api";
import { ApiError } from "@/lib/api/errors";
import type { StatusIncident, StatusIncidentUpdate } from "@/features/status-page/types";
import type { StatusIncidentPayload, StatusIncidentUpdatePayload } from "@/features/status-page/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useStatusIncidentsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [incidents, setIncidents] = useState<StatusIncident[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [updatesByIncident, setUpdatesByIncident] = useState<Record<string, StatusIncidentUpdate[]>>({});

  const load = useCallback(async () => {
    try {
      const { data } = await statusPageApi.listStatusIncidents();
      setIncidents(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: StatusIncidentPayload) {
    const { data } = await statusPageApi.createStatusIncident(payload);
    setIncidents((current) => [data, ...current]);
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await statusPageApi.deleteStatusIncident(id);
      setIncidents((current) => current.filter((incident) => incident.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function loadUpdates(id: string) {
    setActionError(null);
    try {
      const { data } = await statusPageApi.listStatusIncidentUpdates(id);
      setUpdatesByIncident((current) => ({ ...current, [id]: data }));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function addUpdate(id: string, payload: StatusIncidentUpdatePayload) {
    const { data } = await statusPageApi.addStatusIncidentUpdate(id, payload);
    setIncidents((current) => current.map((incident) => (incident.id === id ? data : incident)));
    await loadUpdates(id);
  }

  return { loadState, incidents, actionError, create, remove, updatesByIncident, loadUpdates, addUpdate };
}
