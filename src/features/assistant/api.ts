import { apiFetch } from "@/lib/api/client";
import type { AgentTool, AgentToolParameter, AiReply, AssistantSettings } from "@/features/assistant/types";

export function getSettings(): Promise<{ data: AssistantSettings }> {
  return apiFetch("/workspace/assistant/settings");
}

export function updateSettings(payload: Partial<AssistantSettings>): Promise<{ data: AssistantSettings }> {
  return apiFetch("/workspace/assistant/settings", { method: "PUT", body: payload });
}

export function sandbox(message: string): Promise<{ data: AiReply }> {
  return apiFetch("/workspace/assistant/sandbox", { method: "POST", body: { message } });
}

export type AgentToolPayload = {
  name: string;
  description: string;
  http_method: AgentTool["http_method"];
  url: string;
  headers?: Record<string, string>;
  enabled?: boolean;
  parameters?: AgentToolParameter[];
};

export function listAgentTools(): Promise<{ data: AgentTool[] }> {
  return apiFetch("/workspace/assistant/tools");
}

export function createAgentTool(payload: AgentToolPayload): Promise<{ data: AgentTool }> {
  return apiFetch("/workspace/assistant/tools", { method: "POST", body: payload });
}

export function updateAgentTool(id: string, payload: AgentToolPayload): Promise<{ data: AgentTool }> {
  return apiFetch(`/workspace/assistant/tools/${id}`, { method: "PUT", body: payload });
}

export function deleteAgentTool(id: string): Promise<void> {
  return apiFetch(`/workspace/assistant/tools/${id}`, { method: "DELETE" });
}
