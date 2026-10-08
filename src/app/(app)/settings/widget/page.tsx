import { WidgetSettingsPage } from "@/features/widget/components/WidgetSettingsPage";

export default function SettingsWidgetPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Widget</h1>
      <WidgetSettingsPage />
    </div>
  );
}
