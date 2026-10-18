import { CampaignDetailPage } from "@/features/campaigns/components/CampaignDetailPage";

export default async function SettingsCampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Campagne</h1>
      <CampaignDetailPage campaignId={id} />
    </div>
  );
}
