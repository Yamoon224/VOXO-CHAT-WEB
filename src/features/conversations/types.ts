export type ConversationStatus = "open" | "pending" | "resolved";

export type ConversationChannel =
  | "widget"
  | "email"
  | "contact_form"
  | "ticket"
  | "whatsapp"
  | "messenger"
  | "instagram"
  | "telegram"
  | "sms"
  | "x"
  | "viber"
  | "line"
  | "telephony";

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

/** Copilote (section 2.2) : une suggestion, jamais envoyée automatiquement. */
export type AiSuggestion = {
  content: string;
  citations: { title: string; content: string; citation_url: string | null }[];
  confidence: number;
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export type PaginatedConversations = { data: Conversation[]; meta: PaginationMeta };

/** Règles de routage (lot 5, section 2.4 : tourniquet, origine, intention). */
export type RoutingConditionField = "channel" | "message";
export type RoutingConditionOperator = "equals" | "contains";
export type RoutingActionType = "assign_user" | "round_robin";

export type RoutingCondition = { field: RoutingConditionField; operator: RoutingConditionOperator; value: string };

export type RoutingRule = {
  id: string;
  name: string;
  position: number;
  is_active: boolean;
  conditions: RoutingCondition[];
  action_type: RoutingActionType;
  action_type_label: string;
  assignee_user_ids: string[];
};

/** Sous-boîtes (lot 5, section 2.4) : les mêmes filtres que la liste des conversations, enregistrés sous un nom. */
export type InboxViewFilters = {
  status?: ConversationStatus;
  assigned_user_id?: string;
  channel?: ConversationChannel;
  needs_human?: boolean;
};

export type InboxView = {
  id: string;
  name: string;
  position: number;
  filters: InboxViewFilters;
};
