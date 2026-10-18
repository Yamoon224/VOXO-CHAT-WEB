import { apiFetch } from "@/lib/api/client";
import type { Campaign, CampaignChannel, CampaignSend, CampaignTemplate } from "@/features/campaigns/types";

export function listCampaignTemplates(): Promise<{ data: CampaignTemplate[] }> {
  return apiFetch("/workspace/campaign-templates");
}

export type CampaignTemplatePayload = { name: string; channel: CampaignChannel; subject: string | null; body: string };

export function createCampaignTemplate(payload: CampaignTemplatePayload): Promise<{ data: CampaignTemplate }> {
  return apiFetch("/workspace/campaign-templates", { method: "POST", body: payload });
}

export function updateCampaignTemplate(id: string, payload: CampaignTemplatePayload): Promise<{ data: CampaignTemplate }> {
  return apiFetch(`/workspace/campaign-templates/${id}`, { method: "PUT", body: payload });
}

export function deleteCampaignTemplate(id: string): Promise<void> {
  return apiFetch(`/workspace/campaign-templates/${id}`, { method: "DELETE" });
}

export function listCampaigns(): Promise<{ data: Campaign[] }> {
  return apiFetch("/workspace/campaigns");
}

export function getCampaign(id: string): Promise<{ data: Campaign }> {
  return apiFetch(`/workspace/campaigns/${id}`);
}

export type CampaignPayload = { name: string; channel: CampaignChannel; segment_id: string; template_id: string };

export function createCampaign(payload: CampaignPayload): Promise<{ data: Campaign }> {
  return apiFetch("/workspace/campaigns", { method: "POST", body: payload });
}

export function updateCampaign(id: string, payload: CampaignPayload): Promise<{ data: Campaign }> {
  return apiFetch(`/workspace/campaigns/${id}`, { method: "PUT", body: payload });
}

export function deleteCampaign(id: string): Promise<void> {
  return apiFetch(`/workspace/campaigns/${id}`, { method: "DELETE" });
}

export function sendCampaign(id: string): Promise<{ data: Campaign }> {
  return apiFetch(`/workspace/campaigns/${id}/send`, { method: "POST" });
}

export function listCampaignSends(id: string): Promise<{ data: CampaignSend[] }> {
  return apiFetch(`/workspace/campaigns/${id}/sends`);
}
