import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as conversationsApi from "@/features/conversations/api";
import * as teamApi from "@/features/team/api";
import * as ticketsApi from "@/features/tickets/api";
import { ApiError } from "@/lib/api/errors";
import { useConversationRealtime } from "@/features/conversations/components/useConversationRealtime";
import type { AiSuggestion, CannedResponse, Conversation, ConversationStatus, Message, MessageVisibility } from "@/features/conversations/types";
import type { Member } from "@/features/team/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

const POLL_INTERVAL_MS = 4000;

/**
 * Une conversation et son fil, pour l'écran `/conversations/[id]`.
 *
 * Le fil se met à jour en temps réel quand un serveur Reverb est configuré
 * (section 4.1) ; sinon il se recharge périodiquement (comportement d'avant
 * ce lot, voir `useConversationRealtime`).
 */
export function useConversationDetailPage(conversationId: string) {
  const router = useRouter();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [conversationResponse, messagesResponse, membersResponse, cannedResponsesResponse] = await Promise.all([
        conversationsApi.getConversation(conversationId),
        conversationsApi.listMessages(conversationId),
        teamApi.listMembers(),
        conversationsApi.listCannedResponses().catch(() => ({ data: [] })),
      ]);
      setConversation(conversationResponse.data);
      setMessages(messagesResponse.data);
      setMembers(membersResponse.data);
      setCannedResponses(cannedResponsesResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [conversationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const { available: realtimeAvailable, typingVisitor, visitorPresent, sendTyping } = useConversationRealtime(
    conversationId,
    (message) => setMessages((current) => (current.some((existing) => existing.id === message.id) ? current : [...current, message])),
  );

  useEffect(() => {
    // Le temps réel couvre déjà l'arrivée des messages : sonder en plus
    // serait redondant (voir `useConversationRealtime`).
    if (realtimeAvailable) return;

    const timer = setInterval(() => {
      void conversationsApi.listMessages(conversationId).then(({ data }) => setMessages(data));
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [conversationId, realtimeAvailable]);

  async function changeStatus(status: ConversationStatus) {
    setActionError(null);
    try {
      const { data } = await conversationsApi.updateStatus(conversationId, status);
      setConversation(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function assign(userId: string | null) {
    setActionError(null);
    try {
      const { data } = await conversationsApi.updateAssignment(conversationId, userId);
      setConversation(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function reply(body: string, visibility: MessageVisibility) {
    const { data } = await conversationsApi.postMessage(conversationId, body, visibility);
    // Le temps réel peut livrer le même message (voir `useConversationRealtime`) :
    // jamais de doublon, quel que soit l'ordre d'arrivée des deux.
    setMessages((current) => (current.some((existing) => existing.id === data.id) ? current : [...current, data]));
  }

  async function summarize() {
    setActionError(null);
    try {
      const { data } = await conversationsApi.summarize(conversationId);
      setConversation(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function analyzeSentiment() {
    setActionError(null);
    try {
      const { data } = await conversationsApi.analyzeSentiment(conversationId);
      setConversation(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  /** Copilote (section 2.2) : une suggestion pour `ReplyForm`, jamais envoyée elle-même. */
  async function suggestReply(): Promise<AiSuggestion | null> {
    setActionError(null);
    try {
      const { data } = await conversationsApi.suggestReply(conversationId);
      return data;
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
      return null;
    }
  }

  /** Transforme la conversation en ticket, et file directement sur son écran de suivi. */
  async function openTicket() {
    setActionError(null);
    try {
      const { data } = await ticketsApi.openTicketFromConversation(conversationId);
      router.push(`/tickets/${data.id}`);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return {
    loadState,
    conversation,
    messages,
    members,
    cannedResponses,
    actionError,
    typingVisitor,
    visitorPresent,
    sendTyping,
    changeStatus,
    assign,
    reply,
    summarize,
    analyzeSentiment,
    suggestReply,
    openTicket,
  };
}
