export type PublicStatusProbeStatus = "unknown" | "up" | "down";

export type PublicStatusProbe = {
  id: string;
  name: string;
  status: PublicStatusProbeStatus;
  status_label: string;
  uptime_ratio: number | null;
};

export type PublicStatusIncidentUpdate = {
  id: string;
  status: string;
  status_label: string;
  body: string;
  created_at: string | null;
};

export type PublicStatusIncident = {
  id: string;
  title: string;
  status: string;
  status_label: string;
  impact: string;
  impact_label: string;
  started_at: string;
  resolved_at: string | null;
  updates: PublicStatusIncidentUpdate[];
};

export type PublicStatusMaintenance = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  status_label: string;
  scheduled_start: string;
  scheduled_end: string;
};

export type PublicStatusOverview = {
  probes: PublicStatusProbe[];
  ongoing_incidents: PublicStatusIncident[];
  upcoming_maintenances: PublicStatusMaintenance[];
};
