export type CampaignChannel = "email" | "chat";

export const CAMPAIGN_CHANNEL_LABELS: Record<CampaignChannel, string> = {
  email: "E-mail",
  chat: "Chat",
};

export type CampaignTemplate = {
  id: string;
  name: string;
  channel: CampaignChannel;
  channel_label: string;
  subject: string | null;
  body: string;
  created_at: string | null;
};

export type CampaignStatus = "draft" | "sent";

export type CampaignStats = { pending: number; sent: number; failed: number; skipped: number };

export type Campaign = {
  id: string;
  name: string;
  channel: CampaignChannel;
  channel_label: string;
  segment_id: string;
  template_id: string;
  status: CampaignStatus;
  status_label: string;
  sent_at: string | null;
  created_at: string | null;
  stats: CampaignStats;
};

export type CampaignSendStatus = "pending" | "sent" | "failed" | "skipped";

export type CampaignSend = {
  id: string;
  contact_id: string;
  contact_name: string | null;
  contact_email: string | null;
  status: CampaignSendStatus;
  status_label: string;
  error: string | null;
  sent_at: string | null;
};
