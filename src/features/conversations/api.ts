import { apiFetch } from "@/lib/api/client";
import type {
  CannedResponse,
  Conversation,
  ConversationStatus,
  Message,
  MessageVisibility,
  PaginatedConversations,
} from "@/features/conversations/types";

export function listConversations(filters: { status?: ConversationStatus | ""; needsHuman?: boolean } = {}): Promise<PaginatedConversations> {
  return apiFetch("/workspace/conversations", {
    query: { status: filters.status || undefined, needs_human: filters.needsHuman ?? undefined },
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
