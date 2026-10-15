import { useCallback, useEffect, useState } from "react";
import * as conversationsApi from "@/features/conversations/api";
import * as teamApi from "@/features/team/api";
import { ApiError } from "@/lib/api/errors";
import type { Conversation, ConversationChannel, ConversationStatus, InboxView, InboxViewFilters } from "@/features/conversations/types";
import type { Member } from "@/features/team/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Boîte de réception de l'espace de travail courant : la liste, avec ses filtres et ses sous-boîtes (lot 5, section 2.4). */
export function useConversationListPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "">("");
  const [needsHumanOnly, setNeedsHumanOnly] = useState(false);
  const [channelFilter, setChannelFilter] = useState<ConversationChannel | "">("");
  const [assignedUserFilter, setAssignedUserFilter] = useState("");
  const [inboxViews, setInboxViews] = useState<InboxView[]>([]);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const load = useCallback(
    async (status: ConversationStatus | "", needsHumanOnly: boolean, channel: ConversationChannel | "", assignedUserId: string) => {
      try {
        const { data } = await conversationsApi.listConversations({
          status,
          needsHuman: needsHumanOnly ? true : undefined,
          channel,
          assignedUserId: assignedUserId || undefined,
        });
        setConversations(data);
        setLoadState({ status: "ready" });
      } catch (caught) {
        setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
      }
    },
    [],
  );

  useEffect(() => {
    void load(statusFilter, needsHumanOnly, channelFilter, assignedUserFilter);
  }, [load, statusFilter, needsHumanOnly, channelFilter, assignedUserFilter]);

  useEffect(() => {
    void conversationsApi.listInboxViews().then(({ data }) => setInboxViews(data));
    void teamApi.listMembers().then(({ data }) => setMembers(data));
  }, []);

  function currentFilters(): InboxViewFilters {
    return {
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(channelFilter ? { channel: channelFilter } : {}),
      ...(assignedUserFilter ? { assigned_user_id: assignedUserFilter } : {}),
      ...(needsHumanOnly ? { needs_human: true } : {}),
    };
  }

  function applyView(view: InboxView) {
    setActiveViewId(view.id);
    setStatusFilter(view.filters.status ?? "");
    setChannelFilter(view.filters.channel ?? "");
    setAssignedUserFilter(view.filters.assigned_user_id ?? "");
    setNeedsHumanOnly(view.filters.needs_human ?? false);
  }

  function clearView() {
    setActiveViewId(null);
    setStatusFilter("");
    setChannelFilter("");
    setAssignedUserFilter("");
    setNeedsHumanOnly(false);
  }

  async function saveCurrentAsView(name: string) {
    const { data } = await conversationsApi.createInboxView(name, currentFilters(), inboxViews.length);
    setInboxViews((current) => [...current, data]);
    setActiveViewId(data.id);
  }

  async function removeView(id: string) {
    await conversationsApi.deleteInboxView(id);
    setInboxViews((current) => current.filter((view) => view.id !== id));
    if (activeViewId === id) {
      clearView();
    }
  }

  return {
    loadState,
    conversations,
    statusFilter,
    setStatusFilter,
    needsHumanOnly,
    setNeedsHumanOnly,
    channelFilter,
    setChannelFilter,
    assignedUserFilter,
    setAssignedUserFilter,
    inboxViews,
    activeViewId,
    applyView,
    clearView,
    saveCurrentAsView,
    removeView,
    members,
  };
}
