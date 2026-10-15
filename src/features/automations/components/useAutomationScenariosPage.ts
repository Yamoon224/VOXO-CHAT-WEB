import { useCallback, useEffect, useState } from "react";
import * as automationsApi from "@/features/automations/api";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { AutomationScenario } from "@/features/automations/types";
import type { Member } from "@/features/team/types";
import type { AutomationScenarioPayload } from "@/features/automations/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useAutomationScenariosPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [scenarios, setScenarios] = useState<AutomationScenario[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [scenariosResponse, membersResponse] = await Promise.all([automationsApi.listAutomations(), teamApi.listMembers()]);
      setScenarios(scenariosResponse.data);
      setMembers(membersResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: AutomationScenarioPayload) {
    const { data } = await automationsApi.createAutomation({ ...payload, position: scenarios.length });
    setScenarios((current) => [...current, data]);
  }

  async function update(id: string, payload: AutomationScenarioPayload) {
    const { data } = await automationsApi.updateAutomation(id, payload);
    setScenarios((current) => current.map((scenario) => (scenario.id === id ? data : scenario)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await automationsApi.deleteAutomation(id);
      setScenarios((current) => current.filter((scenario) => scenario.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, scenarios, members, actionError, create, update, remove };
}
