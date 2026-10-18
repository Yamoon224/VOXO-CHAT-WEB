import { CampaignsPage } from "@/features/campaigns/components/CampaignsPage";
import { CampaignTemplatesPage } from "@/features/campaigns/components/CampaignTemplatesPage";

export default function SettingsCampaignsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Campagnes</h1>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Modèles</h2>
        <CampaignTemplatesPage />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Campagnes</h2>
        <CampaignsPage />
      </section>
    </div>
  );
}
