import { useCallback, useEffect, useState } from "react";
import * as conversationsApi from "@/features/conversations/api";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { CannedResponse, Conversation, ConversationStatus, Message, MessageVisibility } from "@/features/conversations/types";
import type { Member } from "@/features/team/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

const POLL_INTERVAL_MS = 4000;

/**
 * Une conversation et son fil, pour l'écran `/conversations/[id]`.
 *
 * Le fil se recharge périodiquement tant que l'écran est ouvert : rien côté
 * client ne prévient de l'arrivée d'un nouveau message du visiteur (pas de
 * temps réel pour l'instant, voir la note de portée du lot 2).
 */
export function useConversationDetailPage(conversationId: string) {
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

  useEffect(() => {
    const timer = setInterval(() => {
      void conversationsApi.listMessages(conversationId).then(({ data }) => setMessages(data));
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [conversationId]);

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
    setMessages((current) => [...current, data]);
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

  return {
    loadState,
    conversation,
    messages,
    members,
    cannedResponses,
    actionError,
    changeStatus,
    assign,
    reply,
    summarize,
    analyzeSentiment,
  };
}
