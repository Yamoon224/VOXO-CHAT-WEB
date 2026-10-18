import { useCallback, useEffect, useState } from "react";
import * as campaignsApi from "@/features/campaigns/api";
import { ApiError } from "@/lib/api/errors";
import type { Campaign, CampaignSend } from "@/features/campaigns/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useCampaignDetailPage(campaignId: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [sends, setSends] = useState<CampaignSend[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [campaignResponse, sendsResponse] = await Promise.all([
        campaignsApi.getCampaign(campaignId),
        campaignsApi.listCampaignSends(campaignId),
      ]);
      setCampaign(campaignResponse.data);
      setSends(sendsResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [campaignId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function send() {
    setActionError(null);
    try {
      await campaignsApi.sendCampaign(campaignId);
      await load();
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, campaign, sends, actionError, send, reload: load };
}
