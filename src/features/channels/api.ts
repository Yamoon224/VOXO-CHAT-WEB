import { apiFetch } from "@/lib/api/client";
import type { ChannelEmailSettings } from "@/features/channels/types";

export function getEmailSettings(): Promise<{ data: ChannelEmailSettings }> {
  return apiFetch("/workspace/channels/email/settings");
}

export function updateEmailSettings(payload: Partial<ChannelEmailSettings>): Promise<{ data: ChannelEmailSettings }> {
  return apiFetch("/workspace/channels/email/settings", { method: "PUT", body: payload });
}
