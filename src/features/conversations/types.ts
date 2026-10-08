export type ConversationStatus = "open" | "pending" | "resolved";

export type ConversationChannel = "widget";

export type MessageSenderType = "visitor" | "agent" | "ai" | "system";

export type MessageVisibility = "public" | "internal";

export type Conversation = {
  id: string;
  channel: ConversationChannel;
  channel_label: string;
  status: ConversationStatus;
  status_label: string;
  visitor_name: string | null;
  visitor_email: string | null;
  assigned_user: { id: string; name: string } | null;
  subject: string | null;
  summary: string | null;
  sentiment: string | null;
  needs_human: boolean;
  rating: number | null;
  rating_comment: string | null;
  last_message_at: string | null;
  resolved_at: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  sender_type: MessageSenderType;
  sender_label: string;
  sender_user: { id: string; name: string } | null;
  visibility: MessageVisibility;
  body: string;
  citations: { title: string; content: string; citation_url: string | null }[];
  attachment_filename: string | null;
  created_at: string;
};

export type CannedResponse = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export type PaginatedConversations = { data: Conversation[]; meta: PaginationMeta };
