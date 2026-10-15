import { apiFetch } from "@/lib/api/client";
import type { AutomationCondition, AutomationScenario, AutomationStatus, AutomationStep, AutomationTestResult, AutomationTriggerType } from "@/features/automations/types";

export function listAutomations(): Promise<{ data: AutomationScenario[] }> {
  return apiFetch("/workspace/automations");
}

export type AutomationScenarioPayload = {
  name: string;
  position?: number;
  status?: AutomationStatus;
  trigger_type: AutomationTriggerType;
  conditions?: AutomationCondition[];
  steps?: AutomationStep[];
};

export function createAutomation(payload: AutomationScenarioPayload): Promise<{ data: AutomationScenario }> {
  return apiFetch("/workspace/automations", { method: "POST", body: payload });
}

export function updateAutomation(id: string, payload: AutomationScenarioPayload): Promise<{ data: AutomationScenario }> {
  return apiFetch(`/workspace/automations/${id}`, { method: "PUT", body: payload });
}

export function deleteAutomation(id: string): Promise<void> {
  return apiFetch(`/workspace/automations/${id}`, { method: "DELETE" });
}

export function testAutomation(id: string, message: string, channel?: string): Promise<{ data: AutomationTestResult }> {
  return apiFetch(`/workspace/automations/${id}/test`, { method: "POST", body: { message, channel } });
}
