import { useCallback, useEffect, useRef, useState } from "react";
import * as knowledgeApi from "@/features/knowledge/api";
import { ApiError } from "@/lib/api/errors";
import type {
  KnowledgeDocument,
  KnowledgeDocumentStatus,
  KnowledgeQaEntry,
  KnowledgeSearchResult,
  KnowledgeSource,
  RecrawlFrequency,
} from "@/features/knowledge/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Un document encore en traitement justifie de reconsulter son statut sans action de l'appelant. */
function isSettling(document: KnowledgeDocument): boolean {
  return document.status === "pending" || document.status === "processing";
}

const POLL_INTERVAL_MS = 4000;

/**
 * Base de connaissances de l'espace de travail courant : sources, documents
 * et entrées manuelles, avec leurs actions. Une seule source de vérité pour
 * l'écran `/settings/knowledge`.
 *
 * Tant qu'un document est en attente ou en cours de traitement, la liste des
 * documents se recharge périodiquement : l'ingestion tourne en file côté
 * serveur, rien côté client ne prévient de sa fin autrement.
 */
export function useKnowledgePage() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [qaEntries, setQaEntries] = useState<KnowledgeQaEntry[]>([]);
  const [documentStatusFilter, setDocumentStatusFilter] = useState<KnowledgeDocumentStatus | "">("");
  const [actionError, setActionError] = useState<ApiError | null>(null);

  const [searchResults, setSearchResults] = useState<KnowledgeSearchResult[] | null>(null);
  const [searchError, setSearchError] = useState<ApiError | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Lu par des callbacks stables (`load`, `reloadDocuments`) qui ne doivent
  // pas se recréer à chaque changement de filtre : la ref est tenue à jour
  // par un effet, jamais écrite pendant le rendu lui-même.
  const statusFilterRef = useRef(documentStatusFilter);
  useEffect(() => {
    statusFilterRef.current = documentStatusFilter;
  }, [documentStatusFilter]);

  const load = useCallback(async () => {
    try {
      const [sourcesResponse, documentsResponse, qaEntriesResponse] = await Promise.all([
        knowledgeApi.listSources(),
        knowledgeApi.listDocuments({ status: statusFilterRef.current }),
        knowledgeApi.listQaEntries(),
      ]);
      setSources(sourcesResponse.data);
      setDocuments(documentsResponse.data);
      setQaEntries(qaEntriesResponse.data);
      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const reloadDocuments = useCallback(async (status: KnowledgeDocumentStatus | "") => {
    try {
      const { data } = await knowledgeApi.listDocuments({ status });
      setDocuments(data);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }, []);

  async function filterDocuments(status: KnowledgeDocumentStatus | "") {
    setDocumentStatusFilter(status);
    await reloadDocuments(status);
  }

  // Tant qu'un document affiché est encore en traitement, on revient le
  // consulter périodiquement — nettoyé à chaque changement de liste et au
  // démontage, pour ne jamais accumuler plusieurs minuteurs.
  useEffect(() => {
    if (!documents.some(isSettling)) {
      return;
    }

    const timer = setInterval(() => {
      void reloadDocuments(statusFilterRef.current);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [documents, reloadDocuments]);

  async function uploadFiles(name: string, files: File[]) {
    const { data } = await knowledgeApi.uploadFiles(name, files);
    setSources((current) => [data, ...current]);
    await reloadDocuments(statusFilterRef.current);
  }

  async function createWebsiteSource(payload: { name?: string; url: string; sitemapUrl?: string; recrawlFrequency: RecrawlFrequency }) {
    const { data } = await knowledgeApi.createWebsiteSource({
      name: payload.name,
      url: payload.url,
      sitemap_url: payload.sitemapUrl,
      recrawl_frequency: payload.recrawlFrequency,
    });
    setSources((current) => [data, ...current]);
    await reloadDocuments(statusFilterRef.current);
  }

  async function deleteSource(sourceId: string) {
    setActionError(null);
    try {
      await knowledgeApi.deleteSource(sourceId);
      setSources((current) => current.filter((source) => source.id !== sourceId));
      await reloadDocuments(statusFilterRef.current);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function recrawlSource(sourceId: string) {
    setActionError(null);
    try {
      await knowledgeApi.recrawlSource(sourceId);
      await reloadDocuments(statusFilterRef.current);
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function deleteDocument(documentId: string) {
    setActionError(null);
    try {
      await knowledgeApi.deleteDocument(documentId);
      setDocuments((current) => current.filter((document) => document.id !== documentId));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function retryDocument(documentId: string) {
    setActionError(null);
    try {
      const { data } = await knowledgeApi.retryDocument(documentId);
      setDocuments((current) => current.map((document) => (document.id === documentId ? data : document)));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function createQaEntry(question: string, answer: string) {
    const { data } = await knowledgeApi.createQaEntry(question, answer);
    setQaEntries((current) => [data, ...current]);
    await reloadDocuments(statusFilterRef.current);
  }

  async function updateQaEntry(entryId: string, question: string, answer: string) {
    const { data } = await knowledgeApi.updateQaEntry(entryId, question, answer);
    setQaEntries((current) => current.map((entry) => (entry.id === entryId ? data : entry)));
    await reloadDocuments(statusFilterRef.current);
  }

  async function deleteQaEntry(entryId: string) {
    setActionError(null);
    try {
      await knowledgeApi.deleteQaEntry(entryId);
      setQaEntries((current) => current.filter((entry) => entry.id !== entryId));
    } catch (caught) {
      setActionError(caught instanceof ApiError ? caught : ApiError.networkError());
    }
  }

  async function runSearch(query: string) {
    setIsSearching(true);
    setSearchError(null);
    try {
      const { data } = await knowledgeApi.search(query);
      setSearchResults(data);
    } catch (caught) {
      setSearchError(caught instanceof ApiError ? caught : ApiError.networkError());
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  }

  return {
    loadState,
    sources,
    documents,
    qaEntries,
    documentStatusFilter,
    actionError,
    searchResults,
    searchError,
    isSearching,
    filterDocuments,
    uploadFiles,
    createWebsiteSource,
    deleteSource,
    recrawlSource,
    deleteDocument,
    retryDocument,
    createQaEntry,
    updateQaEntry,
    deleteQaEntry,
    runSearch,
  };
}
