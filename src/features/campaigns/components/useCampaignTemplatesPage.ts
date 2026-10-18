import { useCallback, useEffect, useState } from "react";
import * as campaignsApi from "@/features/campaigns/api";
import { ApiError } from "@/lib/api/errors";
import type { CampaignTemplate } from "@/features/campaigns/types";
import type { CampaignTemplatePayload } from "@/features/campaigns/api";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useCampaignTemplatesPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await campaignsApi.listCampaignTemplates();
      setTemplates(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: CampaignTemplatePayload) {
    const { data } = await campaignsApi.createCampaignTemplate(payload);
    setTemplates((current) => [data, ...current]);
  }

  async function update(id: string, payload: CampaignTemplatePayload) {
    const { data } = await campaignsApi.updateCampaignTemplate(id, payload);
    setTemplates((current) => current.map((template) => (template.id === id ? data : template)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await campaignsApi.deleteCampaignTemplate(id);
      setTemplates((current) => current.filter((template) => template.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, templates, actionError, create, update, remove };
}
