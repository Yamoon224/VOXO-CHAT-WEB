import { apiFetch } from "@/lib/api/client";
import type { Membership, Workspace } from "@/features/workspace/types";

type Envelope<T> = { data: T };

export function listMemberships(): Promise<Envelope<Membership[]>> {
  return apiFetch("/workspaces");
}

export function createWorkspace(name: string): Promise<Envelope<Membership>> {
  return apiFetch("/workspaces", { method: "POST", body: { name } });
}

export function switchWorkspace(workspaceId: string): Promise<Envelope<Membership>> {
  return apiFetch(`/workspaces/${workspaceId}/switch`, { method: "POST" });
}

export function currentWorkspace(): Promise<Envelope<Workspace>> {
  return apiFetch("/workspace");
}

export function updateWorkspace(input: {
  name?: string;
  locale?: string;
  timezone?: string;
}): Promise<Envelope<Workspace>> {
  return apiFetch("/workspace", { method: "PUT", body: input });
}
