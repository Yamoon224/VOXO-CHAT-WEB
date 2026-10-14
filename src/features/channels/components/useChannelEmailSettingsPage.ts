import { useCallback, useEffect, useState } from "react";
import * as channelsApi from "@/features/channels/api";
import { ApiError } from "@/lib/api/errors";
import type { ChannelEmailSettings } from "@/features/channels/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useChannelEmailSettingsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [settings, setSettings] = useState<ChannelEmailSettings | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await channelsApi.getEmailSettings();
      setSettings(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(payload: Partial<ChannelEmailSettings>) {
    setActionError(null);
    try {
      const { data } = await channelsApi.updateEmailSettings(payload);
      setSettings(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
      throw caught;
    }
  }

  return { loadState, settings, actionError, update };
}
