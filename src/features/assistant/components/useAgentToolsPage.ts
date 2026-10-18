import { useCallback, useEffect, useState } from "react";
import * as assistantApi from "@/features/assistant/api";
import { ApiError } from "@/lib/api/errors";
import type { AgentTool } from "@/features/assistant/types";
import type { AgentToolPayload } from "@/features/assistant/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useAgentToolsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [tools, setTools] = useState<AgentTool[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await assistantApi.listAgentTools();
      setTools(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: AgentToolPayload) {
    const { data } = await assistantApi.createAgentTool(payload);
    setTools((current) => [data, ...current]);
  }

  async function update(id: string, payload: AgentToolPayload) {
    const { data } = await assistantApi.updateAgentTool(id, payload);
    setTools((current) => current.map((tool) => (tool.id === id ? data : tool)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await assistantApi.deleteAgentTool(id);
      setTools((current) => current.filter((tool) => tool.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, tools, actionError, create, update, remove };
}
