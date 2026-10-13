import { apiFetch } from "@/lib/api/client";
import type { PaginatedPlatformWorkspaces } from "@/features/platform/types";
import type { Plan, PlanWriteInput } from "@/features/billing/types";

export function listWorkspaces(page?: number): Promise<PaginatedPlatformWorkspaces> {
  return apiFetch("/platform/workspaces", { query: { page } });
}

export function listPlans(): Promise<{ data: Plan[] }> {
  return apiFetch("/platform/plans");
}

export function createPlan(input: PlanWriteInput): Promise<{ data: Plan }> {
  return apiFetch("/platform/plans", { method: "POST", body: input });
}

export function updatePlan(id: string, input: Partial<PlanWriteInput>): Promise<{ data: Plan }> {
  return apiFetch(`/platform/plans/${id}`, { method: "PUT", body: input });
}

export function deletePlan(id: string): Promise<void> {
  return apiFetch(`/platform/plans/${id}`, { method: "DELETE" });
}
