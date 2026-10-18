export type WebhookEventType = "conversation.created" | "conversation.resolved" | "message.created";

export const WEBHOOK_EVENT_TYPE_LABELS: Record<WebhookEventType, string> = {
  "conversation.created": "Conversation créée",
  "conversation.resolved": "Conversation résolue",
  "message.created": "Message créé",
};

export type WebhookSubscription = {
  id: string;
  url: string;
  secret: string;
  event_types: WebhookEventType[];
  enabled: boolean;
  created_at: string | null;
};

export type WebhookDeliveryStatus = "pending" | "success" | "failed";

export type WebhookDelivery = {
  id: string;
  event_type: string;
  status: WebhookDeliveryStatus;
  response_status: number | null;
  attempted_at: string | null;
  created_at: string | null;
};

export type ApiKey = {
  id: string;
  name: string;
  created_by_name: string;
  last_used_at: string | null;
  created_at: string | null;
};
