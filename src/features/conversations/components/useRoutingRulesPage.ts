import { useCallback, useEffect, useState } from "react";
import * as conversationsApi from "@/features/conversations/api";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { RoutingRule } from "@/features/conversations/types";
import type { Member } from "@/features/team/types";
import type { RoutingRulePayload } from "@/features/conversations/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useRoutingRulesPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [rulesResponse, membersResponse] = await Promise.all([conversationsApi.listRoutingRules(), teamApi.listMembers()]);
      setRules(rulesResponse.data);
      setMembers(membersResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: RoutingRulePayload) {
    const { data } = await conversationsApi.createRoutingRule({ ...payload, position: rules.length });
    setRules((current) => [...current, data]);
  }

  async function update(id: string, payload: RoutingRulePayload) {
    const { data } = await conversationsApi.updateRoutingRule(id, payload);
    setRules((current) => current.map((rule) => (rule.id === id ? data : rule)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await conversationsApi.deleteRoutingRule(id);
      setRules((current) => current.filter((rule) => rule.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, rules, members, actionError, create, update, remove };
}
