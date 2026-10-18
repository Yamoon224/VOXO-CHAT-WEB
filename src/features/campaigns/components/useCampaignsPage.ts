import { useCallback, useEffect, useState } from "react";
import * as campaignsApi from "@/features/campaigns/api";
import * as contactsApi from "@/features/contacts/api";
import { ApiError } from "@/lib/api/errors";
import type { Campaign, CampaignTemplate } from "@/features/campaigns/types";
import type { CampaignPayload } from "@/features/campaigns/api";
import type { ContactSegment } from "@/features/contacts/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useCampaignsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<ContactSegment[]>([]);
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [campaignsResponse, segmentsResponse, templatesResponse] = await Promise.all([
        campaignsApi.listCampaigns(),
        contactsApi.listSegments(),
        campaignsApi.listCampaignTemplates(),
      ]);
      setCampaigns(campaignsResponse.data);
      setSegments(segmentsResponse.data);
      setTemplates(templatesResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(payload: CampaignPayload) {
    const { data } = await campaignsApi.createCampaign(payload);
    setCampaigns((current) => [data, ...current]);
  }

  async function update(id: string, payload: CampaignPayload) {
    const { data } = await campaignsApi.updateCampaign(id, payload);
    setCampaigns((current) => current.map((campaign) => (campaign.id === id ? data : campaign)));
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await campaignsApi.deleteCampaign(id);
      setCampaigns((current) => current.filter((campaign) => campaign.id !== id));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function send(id: string) {
    setActionError(null);
    try {
      const { data } = await campaignsApi.sendCampaign(id);
      setCampaigns((current) => current.map((campaign) => (campaign.id === id ? data : campaign)));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, campaigns, segments, templates, actionError, create, update, remove, send };
}
