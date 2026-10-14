export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type Ticket = {
  id: string;
  priority: TicketPriority;
  priority_label: string;
  due_at: string | null;
  is_overdue: boolean;
  created_at: string;
  contact: { id: string; name: string | null; email: string | null } | null;
  conversation: {
    id: string;
    channel: string;
    channel_label: string;
    status: string;
    status_label: string;
    subject: string | null;
    visitor_name: string | null;
    visitor_email: string | null;
    assigned_user: { id: string; name: string } | null;
    last_message_at: string | null;
  };
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export type PaginatedTickets = { data: Ticket[]; meta: PaginationMeta };
