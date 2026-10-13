import { useCallback, useEffect, useState } from "react";
import * as contactsApi from "@/features/contacts/api";
import { ApiError } from "@/lib/api/errors";
import type { Contact, ContactEvent, ContactNote, ContactWriteInput } from "@/features/contacts/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

export function useContactDetailPage(contactId: string) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [contact, setContact] = useState<Contact | null>(null);
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [events, setEvents] = useState<ContactEvent[]>([]);
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [contactResponse, notesResponse, eventsResponse] = await Promise.all([
        contactsApi.getContact(contactId),
        contactsApi.listNotes(contactId),
        contactsApi.listEvents(contactId),
      ]);
      setContact(contactResponse.data);
      setNotes(notesResponse.data);
      setEvents(eventsResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [contactId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function update(input: Partial<ContactWriteInput>) {
    const { data } = await contactsApi.updateContact(contactId, input);
    setContact(data);
  }

  async function addNote(body: string) {
    setActionError(null);
    try {
      const { data } = await contactsApi.createNote(contactId, body);
      setNotes((current) => [data, ...current]);
      const { data: refreshedEvents } = await contactsApi.listEvents(contactId);
      setEvents(refreshedEvents);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, contact, notes, events, actionError, update, addNote };
}
