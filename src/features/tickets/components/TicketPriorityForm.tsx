"use client";

import { Alert, Button } from "@/components/ui";
import { useTicketPriorityForm } from "@/features/tickets/components/useTicketPriorityForm";
import type { Ticket, TicketPriority } from "@/features/tickets/types";

const PRIORITY_OPTIONS: { value: TicketPriority; label: string }[] = [
  { value: "low", label: "Basse" },
  { value: "normal", label: "Normale" },
  { value: "high", label: "Haute" },
  { value: "urgent", label: "Urgente" },
];

export function TicketPriorityForm({
  ticket,
  update,
}: {
  ticket: Ticket;
  update: (payload: { priority?: TicketPriority; due_at?: string | null }) => Promise<void>;
}) {
  const { priority, setPriority, dueAt, setDueAt, isSubmitting, error, handleSubmit } = useTicketPriorityForm(ticket, update);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ticket-priority" className="text-sm font-medium text-foreground">
          Priorité
        </label>
        <select
          id="ticket-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as TicketPriority)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="ticket-due-at" className="text-sm font-medium text-foreground">
          Échéance
        </label>
        <input
          id="ticket-due-at"
          type="date"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
