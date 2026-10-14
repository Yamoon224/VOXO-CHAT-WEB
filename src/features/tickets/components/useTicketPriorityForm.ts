import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { Ticket, TicketPriority } from "@/features/tickets/types";

export function useTicketPriorityForm(
  ticket: Ticket,
  update: (payload: { priority?: TicketPriority; due_at?: string | null }) => Promise<void>,
) {
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [dueAt, setDueAt] = useState(ticket.due_at ? ticket.due_at.slice(0, 10) : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await update({ priority, due_at: dueAt || null });
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { priority, setPriority, dueAt, setDueAt, isSubmitting, error, handleSubmit };
}
