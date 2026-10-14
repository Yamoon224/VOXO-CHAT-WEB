import { TicketThreadPage } from "@/features/portal/components/TicketThreadPage";

export default async function PortalTicketThreadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token = "" } = await searchParams;

  return <TicketThreadPage token={token} ticketId={id} />;
}
