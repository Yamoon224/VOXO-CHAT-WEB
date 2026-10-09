import { apiFetch } from "@/lib/api/client";
import type { PaginatedPlatformWorkspaces } from "@/features/platform/types";

export function listWorkspaces(page?: number): Promise<PaginatedPlatformWorkspaces> {
  return apiFetch("/platform/workspaces", { query: { page } });
}
