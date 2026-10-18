export type StatusProbeStatus = "unknown" | "up" | "down";

export type StatusProbe = {
  id: string;
  name: string;
  url: string;
  check_interval_minutes: number;
  status: StatusProbeStatus;
  status_label: string;
  last_checked_at: string | null;
  consecutive_failures: number;
};

export type StatusIncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";
export type StatusIncidentImpact = "none" | "minor" | "major" | "critical";

export const STATUS_INCIDENT_STATUS_LABELS: Record<StatusIncidentStatus, string> = {
  investigating: "En investigation",
  identified: "Cause identifiée",
  monitoring: "Sous surveillance",
  resolved: "Résolu",
};

export const STATUS_INCIDENT_IMPACT_LABELS: Record<StatusIncidentImpact, string> = {
  none: "Aucun",
  minor: "Mineur",
  major: "Majeur",
  critical: "Critique",
};

export type StatusIncident = {
  id: string;
  title: string;
  status: StatusIncidentStatus;
  status_label: string;
  impact: StatusIncidentImpact;
  impact_label: string;
  started_at: string;
  resolved_at: string | null;
};

export type StatusIncidentUpdate = {
  id: string;
  status: StatusIncidentStatus;
  status_label: string;
  body: string;
  created_at: string | null;
};

export type StatusMaintenanceStatus = "scheduled" | "in_progress" | "completed";

export const STATUS_MAINTENANCE_STATUS_LABELS: Record<StatusMaintenanceStatus, string> = {
  scheduled: "Planifiée",
  in_progress: "En cours",
  completed: "Terminée",
};

export type StatusMaintenance = {
  id: string;
  title: string;
  description: string | null;
  status: StatusMaintenanceStatus;
  status_label: string;
  scheduled_start: string;
  scheduled_end: string;
};

export type StatusSubscriber = {
  id: string;
  email: string;
  created_at: string | null;
};
