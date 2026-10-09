import { AnalyticsPage } from "@/features/analytics/components/AnalyticsPage";

export default function AnalyticsRoutePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Statistiques</h1>
      <AnalyticsPage />
    </div>
  );
}
