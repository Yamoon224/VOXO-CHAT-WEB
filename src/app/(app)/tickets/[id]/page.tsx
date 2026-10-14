import { TicketDetailPage } from "@/features/tickets/components/TicketDetailPage";

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Ticket</h1>
      <TicketDetailPage ticketId={id} />
    </div>
  );
}
