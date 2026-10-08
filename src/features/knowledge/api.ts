import { apiFetch } from "@/lib/api/client";
import type {
  KnowledgeDocument,
  KnowledgeDocumentStatus,
  KnowledgeQaEntry,
  KnowledgeSearchResult,
  KnowledgeSource,
  PaginatedDocuments,
  PaginatedQaEntries,
  PaginatedSources,
  RecrawlFrequency,
} from "@/features/knowledge/types";

export function listSources(): Promise<PaginatedSources> {
  return apiFetch("/workspace/knowledge/sources");
}

export function uploadFiles(name: string, files: File[]): Promise<{ data: KnowledgeSource }> {
  const form = new FormData();
  form.set("name", name);
  for (const file of files) {
    form.append("files[]", file);
  }

  return apiFetch("/workspace/knowledge/uploads", { method: "POST", body: form });
}

export function createWebsiteSource(payload: {
  name?: string;
  url: string;
  sitemap_url?: string;
  recrawl_frequency: RecrawlFrequency;
}): Promise<{ data: KnowledgeSource }> {
  return apiFetch("/workspace/knowledge/websites", { method: "POST", body: payload });
}

export function deleteSource(sourceId: string): Promise<void> {
  return apiFetch(`/workspace/knowledge/sources/${sourceId}`, { method: "DELETE" });
}

export function recrawlSource(sourceId: string): Promise<void> {
  return apiFetch(`/workspace/knowledge/sources/${sourceId}/recrawl`, { method: "POST" });
}

export function listDocuments(filters: { status?: KnowledgeDocumentStatus | ""; sourceId?: string } = {}): Promise<PaginatedDocuments> {
  return apiFetch("/workspace/knowledge/documents", {
    query: { status: filters.status || undefined, source_id: filters.sourceId || undefined },
  });
}

export function deleteDocument(documentId: string): Promise<void> {
  return apiFetch(`/workspace/knowledge/documents/${documentId}`, { method: "DELETE" });
}

export function retryDocument(documentId: string): Promise<{ data: KnowledgeDocument }> {
  return apiFetch(`/workspace/knowledge/documents/${documentId}/retry`, { method: "POST" });
}

export function listQaEntries(): Promise<PaginatedQaEntries> {
  return apiFetch("/workspace/knowledge/qa-entries");
}

export function createQaEntry(question: string, answer: string): Promise<{ data: KnowledgeQaEntry }> {
  return apiFetch("/workspace/knowledge/qa-entries", { method: "POST", body: { question, answer } });
}

export function updateQaEntry(entryId: string, question: string, answer: string): Promise<{ data: KnowledgeQaEntry }> {
  return apiFetch(`/workspace/knowledge/qa-entries/${entryId}`, { method: "PUT", body: { question, answer } });
}

export function deleteQaEntry(entryId: string): Promise<void> {
  return apiFetch(`/workspace/knowledge/qa-entries/${entryId}`, { method: "DELETE" });
}

export function search(query: string, limit = 5): Promise<{ data: KnowledgeSearchResult[] }> {
  return apiFetch("/workspace/knowledge/search", { method: "POST", body: { query, limit } });
}
