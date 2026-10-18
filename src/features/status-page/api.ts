import { apiFetch } from "@/lib/api/client";
import type {
  StatusIncident,
  StatusIncidentImpact,
  StatusIncidentStatus,
  StatusIncidentUpdate,
  StatusMaintenance,
  StatusMaintenanceStatus,
  StatusProbe,
  StatusSubscriber,
} from "@/features/status-page/types";

export function listStatusProbes(): Promise<{ data: StatusProbe[] }> {
  return apiFetch("/workspace/status-page/probes");
}

export type StatusProbePayload = { name: string; url: string; check_interval_minutes: number };

export function createStatusProbe(payload: StatusProbePayload): Promise<{ data: StatusProbe }> {
  return apiFetch("/workspace/status-page/probes", { method: "POST", body: payload });
}

export function updateStatusProbe(id: string, payload: StatusProbePayload): Promise<{ data: StatusProbe }> {
  return apiFetch(`/workspace/status-page/probes/${id}`, { method: "PUT", body: payload });
}

export function deleteStatusProbe(id: string): Promise<void> {
  return apiFetch(`/workspace/status-page/probes/${id}`, { method: "DELETE" });
}

export function listStatusIncidents(): Promise<{ data: StatusIncident[] }> {
  return apiFetch("/workspace/status-page/incidents");
}

export type StatusIncidentPayload = { title: string; impact: StatusIncidentImpact; status: StatusIncidentStatus; body: string };

export function createStatusIncident(payload: StatusIncidentPayload): Promise<{ data: StatusIncident }> {
  return apiFetch("/workspace/status-page/incidents", { method: "POST", body: payload });
}

export function deleteStatusIncident(id: string): Promise<void> {
  return apiFetch(`/workspace/status-page/incidents/${id}`, { method: "DELETE" });
}

export function listStatusIncidentUpdates(id: string): Promise<{ data: StatusIncidentUpdate[] }> {
  return apiFetch(`/workspace/status-page/incidents/${id}/updates`);
}

export type StatusIncidentUpdatePayload = { status: StatusIncidentStatus; body: string };

export function addStatusIncidentUpdate(id: string, payload: StatusIncidentUpdatePayload): Promise<{ data: StatusIncident }> {
  return apiFetch(`/workspace/status-page/incidents/${id}/updates`, { method: "POST", body: payload });
}

export function listStatusMaintenances(): Promise<{ data: StatusMaintenance[] }> {
  return apiFetch("/workspace/status-page/maintenances");
}

export type StatusMaintenancePayload = {
  title: string;
  description: string | null;
  status?: StatusMaintenanceStatus;
  scheduled_start: string;
  scheduled_end: string;
};

export function createStatusMaintenance(payload: StatusMaintenancePayload): Promise<{ data: StatusMaintenance }> {
  return apiFetch("/workspace/status-page/maintenances", { method: "POST", body: payload });
}

export function updateStatusMaintenance(id: string, payload: StatusMaintenancePayload): Promise<{ data: StatusMaintenance }> {
  return apiFetch(`/workspace/status-page/maintenances/${id}`, { method: "PUT", body: payload });
}

export function deleteStatusMaintenance(id: string): Promise<void> {
  return apiFetch(`/workspace/status-page/maintenances/${id}`, { method: "DELETE" });
}

export function listStatusSubscribers(): Promise<{ data: StatusSubscriber[] }> {
  return apiFetch("/workspace/status-page/subscribers");
}

export function deleteStatusSubscriber(id: string): Promise<void> {
  return apiFetch(`/workspace/status-page/subscribers/${id}`, { method: "DELETE" });
}
