"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, EmptyState, Spinner } from "@/components/ui";
import type { ApiError } from "@/lib/api/errors";
import type { KnowledgeSearchResult } from "@/features/knowledge/types";

/**
 * Aperçu de la recherche sémantique que l'agent IA utilisera (lot 2) : utile
 * pour vérifier, une fois une source indexée, que la base de connaissances
 * répond bien à une question donnée.
 */
export function SearchPanel({
  results,
  error,
  isSearching,
  onSearch,
}: {
  results: KnowledgeSearchResult[] | null;
  error: ApiError | null;
  isSearching: boolean;
  onSearch: (query: string) => Promise<void>;
}) {
  const [query, setQuery] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (query.trim().length < 2) {
      return;
    }
    await onSearch(query);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} noValidate className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="knowledge-search-query" className="text-sm font-medium text-foreground">
            Question
          </label>
          <input
            id="knowledge-search-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Quels sont vos horaires ?"
            className="mt-1.5 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          />
        </div>
        <Button type="submit" isLoading={isSearching}>
          Rechercher
        </Button>
      </form>

      {error && <Alert variant="error">{error.message}</Alert>}

      {isSearching && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Recherche en cours…
        </div>
      )}

      {!isSearching && results !== null && results.length === 0 && (
        <EmptyState title="Aucun passage trouvé" description="Essayez une autre formulation, ou vérifiez que des documents sont indexés." />
      )}

      {!isSearching && results !== null && results.length > 0 && (
        <ul className="flex flex-col gap-3">
          {results.map((result, index) => (
            <li key={`${result.document_id}-${index}`} className="rounded-md border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{result.document_title}</p>
                <span className="text-xs text-muted">score {result.score.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{result.chunk_content}</p>
              {result.citation_url && (
                <a href={result.citation_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-primary">
                  {result.citation_url}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
