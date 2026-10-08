import { useCallback, useEffect, useState } from "react";
import * as widgetApi from "@/features/widget/api";
import { ApiError } from "@/lib/api/errors";
import type { WidgetSettings } from "@/features/widget/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useWidgetSettingsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [script, setScript] = useState<string | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [settingsResponse, scriptResponse] = await Promise.all([widgetApi.getSettings(), widgetApi.getScript()]);
      setSettings(settingsResponse.data);
      setScript(scriptResponse.data.script);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(payload: Partial<WidgetSettings>) {
    setActionError(null);
    try {
      const { data } = await widgetApi.updateSettings(payload);
      setSettings(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
      throw caught;
    }
  }

  return { loadState, settings, script, actionError, update };
}
