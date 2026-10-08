import { TeamPage } from "@/features/team/components/TeamPage";

export default function SettingsTeamPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Équipe</h1>
      <TeamPage />
    </div>
  );
}
