import { useCallback, useEffect, useState } from "react";
import * as integrationsApi from "@/features/integrations/api";
import { ApiError } from "@/lib/api/errors";
import type { ApiKey } from "@/features/integrations/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useApiKeysPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [issuedToken, setIssuedToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await integrationsApi.listApiKeys();
      setApiKeys(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function issue(name: string) {
    const { data } = await integrationsApi.createApiKey(name);
    setIssuedToken(data.token);
    await load();
  }

  async function revoke(id: string) {
    setActionError(null);
    try {
      await integrationsApi.deleteApiKey(id);
      setApiKeys((current) => current.filter((apiKey) => apiKey.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, apiKeys, actionError, issuedToken, dismissIssuedToken: () => setIssuedToken(null), issue, revoke };
}
