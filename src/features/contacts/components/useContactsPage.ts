import { useCallback, useEffect, useState } from "react";
import * as contactsApi from "@/features/contacts/api";
import { ApiError } from "@/lib/api/errors";
import type { Contact, ContactWriteInput } from "@/features/contacts/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };
type Meta = { current_page: number; last_page: number; total: number };

/** Écran `/contacts` : liste, recherche, pagination, et actions de création/suppression. */
export function useContactsPage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const load = useCallback(async (page?: number) => {
    setLoadState({ status: "loading" });
    try {
      const response = await contactsApi.listContacts(search || undefined, page);
      setContacts(response.data);
      setMeta(response.meta);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [search]);

  useEffect(() => {
    void load();
  }, [load]);

  function goToPage(page: number) {
    void load(page);
  }

  async function create(input: ContactWriteInput) {
    const { data } = await contactsApi.createContact(input);
    setContacts((current) => [data, ...current]);
  }

  async function remove(contactId: string) {
    setActionError(null);
    try {
      await contactsApi.deleteContact(contactId);
      setContacts((current) => current.filter((contact) => contact.id !== contactId));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function importCsv(file: File) {
    const { data } = await contactsApi.importContacts(file);
    await load();

    return data;
  }

  async function exportCsv() {
    setActionError(null);
    try {
      await contactsApi.exportContacts();
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  return { loadState, contacts, meta, search, setSearch, actionError, goToPage, create, remove, importCsv, exportCsv };
}
