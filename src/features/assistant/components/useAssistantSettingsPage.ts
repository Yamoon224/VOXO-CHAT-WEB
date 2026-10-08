import { useCallback, useEffect, useState } from "react";
import * as assistantApi from "@/features/assistant/api";
import { ApiError } from "@/lib/api/errors";
import type { AiReply, AssistantSettings } from "@/features/assistant/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useAssistantSettingsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [settings, setSettings] = useState<AssistantSettings | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const [sandboxReply, setSandboxReply] = useState<AiReply | null>(null);
  const [sandboxError, setSandboxError] = useState<ApiError | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await assistantApi.getSettings();
      setSettings(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(payload: Partial<AssistantSettings>) {
    setActionError(null);
    try {
      const { data } = await assistantApi.updateSettings(payload);
      setSettings(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
      throw caught;
    }
  }

  async function testSandbox(message: string) {
    setIsTesting(true);
    setSandboxError(null);
    try {
      const { data } = await assistantApi.sandbox(message);
      setSandboxReply(data);
    } catch (caught) {
      setSandboxError(caught instanceof ApiError ? caught : ApiError.networkError());
      setSandboxReply(null);
    } finally {
      setIsTesting(false);
    }
  }

  return { loadState, settings, actionError, update, sandboxReply, sandboxError, isTesting, testSandbox };
}
