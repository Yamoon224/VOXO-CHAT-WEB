"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import type { Ticket, TicketPriority } from "@/features/tickets/types";

const PRIORITY_TONE: Record<TicketPriority, "neutral" | "primary" | "danger"> = {
  low: "neutral",
  normal: "neutral",
  high: "primary",
  urgent: "danger",
};

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border">
      {tickets.map((ticket) => (
        <li key={ticket.id}>
          <Link
            href={`/tickets/${ticket.id}`}
            className="flex flex-col gap-2 py-3 transition-colors hover:bg-border/20 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                {ticket.conversation.subject ?? ticket.conversation.visitor_name ?? ticket.contact?.name ?? "Demande sans sujet"}
              </p>
              <p className="text-sm text-muted">
                {ticket.contact?.email ?? ticket.conversation.visitor_email ?? "Sans adresse"}
                {ticket.conversation.assigned_user && ` — Affecté à ${ticket.conversation.assigned_user.name}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {ticket.is_overdue && <Badge tone="danger">En retard</Badge>}
              <Badge tone="neutral">{ticket.conversation.status_label}</Badge>
              <Badge tone={PRIORITY_TONE[ticket.priority]}>{ticket.priority_label}</Badge>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
