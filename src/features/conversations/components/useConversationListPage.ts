import { useCallback, useEffect, useState } from "react";
import * as conversationsApi from "@/features/conversations/api";
import { ApiError } from "@/lib/api/errors";
import type { Conversation, ConversationStatus } from "@/features/conversations/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Boîte de réception de l'espace de travail courant : la liste, avec ses filtres. */
export function useConversationListPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "">("");
  const [needsHumanOnly, setNeedsHumanOnly] = useState(false);

  const load = useCallback(async (status: ConversationStatus | "", needsHumanOnly: boolean) => {
    try {
      const { data } = await conversationsApi.listConversations({ status, needsHuman: needsHumanOnly ? true : undefined });
      setConversations(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load(statusFilter, needsHumanOnly);
  }, [load, statusFilter, needsHumanOnly]);

  return { loadState, conversations, statusFilter, setStatusFilter, needsHumanOnly, setNeedsHumanOnly };
}
