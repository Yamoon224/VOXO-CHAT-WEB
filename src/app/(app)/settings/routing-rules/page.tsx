import { RoutingRulesPage } from "@/features/conversations/components/RoutingRulesPage";

export default function SettingsRoutingRulesPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Routage</h1>
      <RoutingRulesPage />
    </div>
  );
}
