import { MyTicketsPage } from "@/features/portal/components/MyTicketsPage";

export default async function PortalTicketsPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;

  return <MyTicketsPage token={token} />;
}
