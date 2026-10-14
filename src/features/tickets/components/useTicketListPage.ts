import { useCallback, useEffect, useState } from "react";
import * as ticketsApi from "@/features/tickets/api";
import { ApiError } from "@/lib/api/errors";
import type { Ticket, TicketPriority } from "@/features/tickets/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Écran `/tickets` : la liste, avec son filtre de priorité. */
export function useTicketListPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "">("");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const load = useCallback(async (priority: TicketPriority | "", overdueOnly: boolean) => {
    try {
      const { data } = await ticketsApi.listTickets({ priority, overdue: overdueOnly ? true : undefined });
      setTickets(data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load(priorityFilter, overdueOnly);
  }, [load, priorityFilter, overdueOnly]);

  return { loadState, tickets, priorityFilter, setPriorityFilter, overdueOnly, setOverdueOnly };
}
