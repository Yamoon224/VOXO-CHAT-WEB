import { UnsubscribeStatusAlertsPage } from "@/features/status-page-public/components/UnsubscribeStatusAlertsPage";

export default async function StatusUnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;

  return <UnsubscribeStatusAlertsPage token={token} />;
}
