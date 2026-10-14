"use client";

import Link from "next/link";
import { Alert, Badge, Button, EmptyState, Spinner } from "@/components/ui";
import { useHelpCenterArticlesSection } from "@/features/help-center/components/useHelpCenterArticlesSection";
import type { ArticleStatus } from "@/features/help-center/types";

const STATUS_OPTIONS: { value: ArticleStatus | ""; label: string }[] = [
  { value: "", label: "Tous les statuts" },
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
];

export function HelpCenterArticlesSection() {
  const { loadState, articles, statusFilter, setStatusFilter, actionError, remove } = useHelpCenterArticlesSection();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="help-center-article-status-filter" className="text-sm font-medium text-foreground">
            Statut
          </label>
          <select
            id="help-center-article-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as ArticleStatus | "")}
            className="rounded-md border border-border-strong bg-surface px-2 py-1.5 text-sm text-foreground"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Link href="/settings/help-center/articles/new">
          <Button type="button">Nouvel article</Button>
        </Link>
      </div>

      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      {loadState.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Chargement des articles…
        </div>
      )}

      {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

      {loadState.status === "ready" && articles.length === 0 && (
        <EmptyState title="Aucun article" description="Créez votre premier article du centre d'aide." />
      )}

      {loadState.status === "ready" && articles.length > 0 && (
        <ul className="flex flex-col divide-y divide-border">
          {articles.map((article) => (
            <li key={article.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{article.title}</p>
                <p className="text-sm text-muted">{article.category?.name ?? "Sans catégorie"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={article.status === "published" ? "primary" : "neutral"}>{article.status_label}</Badge>
                <Link href={`/settings/help-center/articles/${article.id}`}>
                  <Button variant="secondary" type="button">
                    Modifier
                  </Button>
                </Link>
                <Button variant="danger" type="button" onClick={() => remove(article.id)}>
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
