import { useCallback, useEffect, useState } from "react";
import * as platformApi from "@/features/platform/api";
import { ApiError } from "@/lib/api/errors";
import type { Plan, PlanWriteInput } from "@/features/billing/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/**
 * Console plateforme : CRUD du catalogue de plans. `enabled` vient de
 * `useRequirePlatformAdmin()`, même garde que `usePlatformWorkspacesPage`.
 */
export function usePlatformPlansPage(enabled: boolean) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    setLoadState({ status: "loading" });
    try {
      const { data } = await platformApi.listPlans();
      setPlans(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      void load();
    }
  }, [enabled, load]);

  async function create(input: PlanWriteInput) {
    const { data } = await platformApi.createPlan(input);
    setPlans((current) => [...current, data].sort((a, b) => a.sort_order - b.sort_order));
  }

  async function update(id: string, input: Partial<PlanWriteInput>) {
    const { data } = await platformApi.updatePlan(id, input);
    setPlans((current) => current.map((plan) => (plan.id === id ? data : plan)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await platformApi.deletePlan(id);
      setPlans((current) => current.filter((plan) => plan.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, plans, actionError, create, update, remove };
}
