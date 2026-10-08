"use client";

import { useState } from "react";
import { Alert, Card, EmptyState, Spinner } from "@/components/ui";
import { useSession } from "@/lib/auth/session-context";
import { useKnowledgePage } from "@/features/knowledge/components/useKnowledgePage";
import { SourceList } from "@/features/knowledge/components/SourceList";
import { UploadSourceForm } from "@/features/knowledge/components/UploadSourceForm";
import { WebsiteSourceForm } from "@/features/knowledge/components/WebsiteSourceForm";
import { DocumentList } from "@/features/knowledge/components/DocumentList";
import { QaEntryList } from "@/features/knowledge/components/QaEntryList";
import { QaEntryForm } from "@/features/knowledge/components/QaEntryForm";
import { SearchPanel } from "@/features/knowledge/components/SearchPanel";

type Tab = "sources" | "documents" | "qa" | "search";

const TABS: { id: Tab; label: string }[] = [
  { id: "sources", label: "Sources" },
  { id: "documents", label: "Documents" },
  { id: "qa", label: "Questions / réponses" },
  { id: "search", label: "Rechercher" },
];

/** Écran `/settings/knowledge` : sources, documents, entrées manuelles, recherche. */
export function KnowledgePage() {
  const { session } = useSession();
  const [tab, setTab] = useState<Tab>("sources");
  const [editingQaEntryId, setEditingQaEntryId] = useState<string | null>(null);

  const {
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
  } = useKnowledgePage();

  const canView = session?.permissions.includes("knowledge.view") ?? false;
  const canManage = session?.permissions.includes("knowledge.manage") ?? false;

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement de la base de connaissances…
      </div>
    );
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  if (!canView) {
    return <Alert variant="info">Vous n&apos;avez pas accès à la base de connaissances de cet espace.</Alert>;
  }

  const editingEntry = qaEntries.find((entry) => entry.id === editingQaEntryId) ?? null;

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <div role="tablist" className="flex gap-2 border-b border-border">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              tab === item.id ? "border-b-2 border-primary text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "sources" && (
        <div className="flex flex-col gap-6">
          {canManage && (
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <h2 className="mb-4 text-sm font-semibold text-foreground">Importer des fichiers</h2>
                <UploadSourceForm upload={uploadFiles} />
              </Card>
              <Card>
                <h2 className="mb-4 text-sm font-semibold text-foreground">Explorer un site web</h2>
                <WebsiteSourceForm create={createWebsiteSource} />
              </Card>
            </div>
          )}

          <Card>
            <h2 className="mb-4 text-sm font-semibold text-foreground">Sources</h2>
            {sources.length === 0 ? (
              <EmptyState title="Aucune source" description="Importez des fichiers ou explorez un site pour commencer." />
            ) : (
              <SourceList sources={sources} canManage={canManage} onDelete={deleteSource} onRecrawl={recrawlSource} />
            )}
          </Card>
        </div>
      )}

      {tab === "documents" && (
        <Card>
          {documents.length === 0 && documentStatusFilter === "" ? (
            <EmptyState title="Aucun document" description="Les documents apparaissent ici une fois une source créée." />
          ) : (
            <DocumentList
              documents={documents}
              canManage={canManage}
              statusFilter={documentStatusFilter}
              onFilterChange={filterDocuments}
              onRetry={retryDocument}
              onDelete={deleteDocument}
            />
          )}
        </Card>
      )}

      {tab === "qa" && (
        <div className="flex flex-col gap-6">
          {canManage && (
            <Card>
              <h2 className="mb-4 text-sm font-semibold text-foreground">
                {editingEntry ? "Modifier l'entrée" : "Ajouter une entrée"}
              </h2>
              <QaEntryForm
                key={editingEntry?.id ?? "new"}
                initial={editingEntry}
                onSubmit={(question, answer) =>
                  editingEntry
                    ? updateQaEntry(editingEntry.id, question, answer).then(() => setEditingQaEntryId(null))
                    : createQaEntry(question, answer)
                }
                onCancel={() => setEditingQaEntryId(null)}
              />
            </Card>
          )}

          <Card>
            <h2 className="mb-4 text-sm font-semibold text-foreground">Entrées manuelles</h2>
            {qaEntries.length === 0 ? (
              <EmptyState title="Aucune entrée" description="Ajoutez une question et sa réponse pour enrichir la base." />
            ) : (
              <QaEntryList
                entries={qaEntries}
                canManage={canManage}
                editingEntryId={editingQaEntryId}
                onEdit={setEditingQaEntryId}
                onCancelEdit={() => setEditingQaEntryId(null)}
                onDelete={deleteQaEntry}
              />
            )}
          </Card>
        </div>
      )}

      {tab === "search" && (
        <Card>
          <SearchPanel results={searchResults} error={searchError} isSearching={isSearching} onSearch={runSearch} />
        </Card>
      )}
    </div>
  );
}
