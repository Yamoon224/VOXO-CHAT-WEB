import { useCallback, useEffect, useState } from "react";
import * as ticketsApi from "@/features/tickets/api";
import { ApiError } from "@/lib/api/errors";
import type { Ticket, TicketPriority } from "@/features/tickets/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useTicketDetailPage(ticketId: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const { data } = await ticketsApi.getTicket(ticketId);
      setTicket(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [ticketId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(payload: { priority?: TicketPriority; due_at?: string | null }) {
    setActionError(null);
    try {
      const { data } = await ticketsApi.updateTicket(ticketId, payload);
      setTicket(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
      throw caught;
    }
  }

  return { loadState, ticket, actionError, update };
}
