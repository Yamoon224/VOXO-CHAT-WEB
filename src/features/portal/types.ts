export type PortalTicketStatus = "open" | "pending" | "resolved";

export type PortalTicket = {
  id: string;
  subject: string | null;
  status: PortalTicketStatus;
  status_label: string;
  priority_label: string;
  last_message_at: string | null;
  created_at: string;
};

export type PortalMessage = {
  id: string;
  sender_type: "visitor" | "agent" | "ai" | "system";
  body: string;
  created_at: string;
};
