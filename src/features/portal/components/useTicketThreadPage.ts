import { useCallback, useEffect, useState } from "react";
import * as portalApi from "@/features/portal/api";
import { ApiError } from "@/lib/api/errors";
import type { PortalMessage, PortalTicket } from "@/features/portal/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useTicketThreadPage(token: string, ticketId: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [ticket, setTicket] = useState<PortalTicket | null>(null);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await portalApi.getMyTicket(token, ticketId);
      setTicket(data.ticket);
      setMessages(data.messages);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [token, ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function reply(body: string) {
    setActionError(null);
    try {
      await portalApi.replyToTicket(token, ticketId, body);
      await load();
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
      throw caught;
    }
  }

  return { loadState, ticket, messages, actionError, reply };
}
