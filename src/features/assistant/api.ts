import { apiFetch } from "@/lib/api/client";
import type { AiReply, AssistantSettings } from "@/features/assistant/types";

export function getSettings(): Promise<{ data: AssistantSettings }> {
  return apiFetch("/workspace/assistant/settings");
}

export function updateSettings(payload: Partial<AssistantSettings>): Promise<{ data: AssistantSettings }> {
  return apiFetch("/workspace/assistant/settings", { method: "PUT", body: payload });
}

export function sandbox(message: string): Promise<{ data: AiReply }> {
  return apiFetch("/workspace/assistant/sandbox", { method: "POST", body: { message } });
}
