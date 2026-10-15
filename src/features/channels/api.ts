import { apiFetch } from "@/lib/api/client";
import type { ChannelConnection, ChannelEmailSettings, MessagingChannel } from "@/features/channels/types";

export function getEmailSettings(): Promise<{ data: ChannelEmailSettings }> {
  return apiFetch("/workspace/channels/email/settings");
}

export function updateEmailSettings(payload: Partial<ChannelEmailSettings>): Promise<{ data: ChannelEmailSettings }> {
  return apiFetch("/workspace/channels/email/settings", { method: "PUT", body: payload });
}

export function getChannelConnection(channel: MessagingChannel): Promise<{ data: ChannelConnection }> {
  return apiFetch(`/workspace/channels/${channel}/connection`);
}

export function updateChannelConnection(
  channel: MessagingChannel,
  payload: { enabled?: boolean; credentials?: Record<string, string> },
): Promise<{ data: ChannelConnection }> {
  return apiFetch(`/workspace/channels/${channel}/connection`, { method: "PUT", body: payload });
}
