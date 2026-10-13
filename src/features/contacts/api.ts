import { apiFetch } from "@/lib/api/client";
import { env } from "@/lib/env";
import { getToken } from "@/lib/auth/token-store";
import type {
  Contact,
  ContactEvent,
  ContactNote,
  ContactSegment,
  ContactWriteInput,
  ImportSummary,
  PaginatedContacts,
} from "@/features/contacts/types";

export function listContacts(search?: string, page?: number): Promise<PaginatedContacts> {
  return apiFetch("/workspace/contacts", { query: { search, page } });
}

export function getContact(contactId: string): Promise<{ data: Contact }> {
  return apiFetch(`/workspace/contacts/${contactId}`);
}

export function createContact(input: ContactWriteInput): Promise<{ data: Contact }> {
  return apiFetch("/workspace/contacts", { method: "POST", body: input });
}

export function updateContact(contactId: string, input: Partial<ContactWriteInput>): Promise<{ data: Contact }> {
  return apiFetch(`/workspace/contacts/${contactId}`, { method: "PUT", body: input });
}

export function deleteContact(contactId: string): Promise<void> {
  return apiFetch(`/workspace/contacts/${contactId}`, { method: "DELETE" });
}

export function listNotes(contactId: string): Promise<{ data: ContactNote[] }> {
  return apiFetch(`/workspace/contacts/${contactId}/notes`);
}

export function createNote(contactId: string, body: string): Promise<{ data: ContactNote }> {
  return apiFetch(`/workspace/contacts/${contactId}/notes`, { method: "POST", body: { body } });
}

export function listEvents(contactId: string): Promise<{ data: ContactEvent[] }> {
  return apiFetch(`/workspace/contacts/${contactId}/events`);
}

export function importContacts(file: File): Promise<{ data: ImportSummary }> {
  const body = new FormData();
  body.append("file", file);

  return apiFetch("/workspace/contacts/import", { method: "POST", body });
}

export function listSegments(): Promise<{ data: ContactSegment[] }> {
  return apiFetch("/workspace/contact-segments");
}

export function createSegment(name: string, criteria: ContactSegment["criteria"]): Promise<{ data: ContactSegment }> {
  return apiFetch("/workspace/contact-segments", { method: "POST", body: { name, criteria } });
}

export function deleteSegment(segmentId: string): Promise<void> {
  return apiFetch(`/workspace/contact-segments/${segmentId}`, { method: "DELETE" });
}

export function segmentContacts(segmentId: string): Promise<{ data: Contact[] }> {
  return apiFetch(`/workspace/contact-segments/${segmentId}/contacts`);
}

/**
 * Pas `apiFetch` : la réponse est un CSV, pas du JSON. Récupère le fichier
 * authentifié puis déclenche le téléchargement navigateur directement.
 */
export async function exportContacts(): Promise<void> {
  const token = getToken();
  const response = await fetch(`${env.apiBaseUrl.replace(/\/$/, "")}/workspace/contacts/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    throw new Error("Échec de l'export.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "contacts.csv";
  link.click();
  URL.revokeObjectURL(url);
}
