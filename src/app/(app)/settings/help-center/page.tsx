import { HelpCenterSettingsPage } from "@/features/help-center/components/HelpCenterSettingsPage";

export default function SettingsHelpCenterPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Centre d&apos;aide</h1>
      <HelpCenterSettingsPage />
    </div>
  );
}
