import { TicketListPage } from "@/features/tickets/components/TicketListPage";

export default function TicketsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Tickets</h1>
      <TicketListPage />
    </div>
  );
}
