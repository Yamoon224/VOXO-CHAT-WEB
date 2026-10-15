import { apiFetch } from "@/lib/api/client";
import type {
  AiSuggestion,
  CannedResponse,
  Conversation,
  ConversationChannel,
  ConversationStatus,
  InboxView,
  InboxViewFilters,
  Message,
  MessageVisibility,
  PaginatedConversations,
  RoutingActionType,
  RoutingCondition,
  RoutingRule,
} from "@/features/conversations/types";

export function listConversations(
  filters: { status?: ConversationStatus | ""; needsHuman?: boolean; channel?: ConversationChannel | ""; assignedUserId?: string } = {},
): Promise<PaginatedConversations> {
  return apiFetch("/workspace/conversations", {
    query: {
      status: filters.status || undefined,
      needs_human: filters.needsHuman ?? undefined,
      channel: filters.channel || undefined,
      assigned_user_id: filters.assignedUserId || undefined,
    },
  });
}

export function getConversation(conversationId: string): Promise<{ data: Conversation }> {
  return apiFetch(`/workspace/conversations/${conversationId}`);
}

export function updateStatus(conversationId: string, status: ConversationStatus): Promise<{ data: Conversation }> {
  return apiFetch(`/workspace/conversations/${conversationId}/status`, { method: "PUT", body: { status } });
}

export function updateAssignment(conversationId: string, userId: string | null): Promise<{ data: Conversation }> {
  return apiFetch(`/workspace/conversations/${conversationId}/assignment`, { method: "PUT", body: { user_id: userId } });
}

export function summarize(conversationId: string): Promise<{ data: Conversation }> {
  return apiFetch(`/workspace/conversations/${conversationId}/summarize`, { method: "POST" });
}

export function analyzeSentiment(conversationId: string): Promise<{ data: Conversation }> {
  return apiFetch(`/workspace/conversations/${conversationId}/sentiment`, { method: "POST" });
}

export function suggestReply(conversationId: string): Promise<{ data: AiSuggestion }> {
  return apiFetch(`/workspace/conversations/${conversationId}/suggest-reply`, { method: "POST" });
}

export function listMessages(conversationId: string): Promise<{ data: Message[] }> {
  return apiFetch(`/workspace/conversations/${conversationId}/messages`);
}

export function postMessage(conversationId: string, body: string, visibility: MessageVisibility): Promise<{ data: Message }> {
  return apiFetch(`/workspace/conversations/${conversationId}/messages`, { method: "POST", body: { body, visibility } });
}

export function listCannedResponses(): Promise<{ data: CannedResponse[] }> {
  return apiFetch("/workspace/canned-responses");
}

export function createCannedResponse(title: string, body: string): Promise<{ data: CannedResponse }> {
  return apiFetch("/workspace/canned-responses", { method: "POST", body: { title, body } });
}

export function updateCannedResponse(id: string, title: string, body: string): Promise<{ data: CannedResponse }> {
  return apiFetch(`/workspace/canned-responses/${id}`, { method: "PUT", body: { title, body } });
}

export function deleteCannedResponse(id: string): Promise<void> {
  return apiFetch(`/workspace/canned-responses/${id}`, { method: "DELETE" });
}

export function listRoutingRules(): Promise<{ data: RoutingRule[] }> {
  return apiFetch("/workspace/routing-rules");
}

export type RoutingRulePayload = {
  name: string;
  position?: number;
  is_active?: boolean;
  conditions?: RoutingCondition[];
  action_type: RoutingActionType;
  assignee_user_ids: string[];
};

export function createRoutingRule(payload: RoutingRulePayload): Promise<{ data: RoutingRule }> {
  return apiFetch("/workspace/routing-rules", { method: "POST", body: payload });
}

export function updateRoutingRule(id: string, payload: RoutingRulePayload): Promise<{ data: RoutingRule }> {
  return apiFetch(`/workspace/routing-rules/${id}`, { method: "PUT", body: payload });
}

export function deleteRoutingRule(id: string): Promise<void> {
  return apiFetch(`/workspace/routing-rules/${id}`, { method: "DELETE" });
}

export function listInboxViews(): Promise<{ data: InboxView[] }> {
  return apiFetch("/workspace/inbox-views");
}

export function createInboxView(name: string, filters: InboxViewFilters, position = 0): Promise<{ data: InboxView }> {
  return apiFetch("/workspace/inbox-views", { method: "POST", body: { name, filters, position } });
}

export function updateInboxView(id: string, name: string, filters: InboxViewFilters, position = 0): Promise<{ data: InboxView }> {
  return apiFetch(`/workspace/inbox-views/${id}`, { method: "PUT", body: { name, filters, position } });
}

export function deleteInboxView(id: string): Promise<void> {
  return apiFetch(`/workspace/inbox-views/${id}`, { method: "DELETE" });
}
