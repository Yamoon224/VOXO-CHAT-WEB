import { ChannelEmailSettingsPage } from "@/features/channels/components/ChannelEmailSettingsPage";
import { ChannelConnectionsPage } from "@/features/channels/components/ChannelConnectionsPage";

export default function SettingsChannelsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Canaux</h1>
      <ChannelEmailSettingsPage />
      <ChannelConnectionsPage />
    </div>
  );
}
