"use client";

import Link from "next/link";
import { Alert, Card, EmptyState, Spinner } from "@/components/ui";
import { useHelpCenterHomePage } from "@/features/help-center-public/components/useHelpCenterHomePage";

/** Écran `/help/[workspace]` : catégories et articles publiés, section 2.10. */
export function HelpCenterHomePage({ workspaceId, categoryId }: { workspaceId: string; categoryId?: string }) {
  const { loadState, categories, articles } = useHelpCenterHomePage(workspaceId, categoryId);

  const activeCategory = categories.find((category) => category.id === categoryId) ?? null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <h1 className="text-xl font-semibold text-foreground">Centre d&apos;aide</h1>

      {loadState.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Chargement…
        </div>
      )}

      {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

      {loadState.status === "ready" && (
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Catégories</h2>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href={`/help/${workspaceId}`} className={categoryId ? "text-primary hover:underline" : "font-medium text-foreground"}>
                  Toutes les catégories
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/help/${workspaceId}?category=${category.id}`}
                    className={category.id === categoryId ? "font-medium text-foreground" : "text-primary hover:underline"}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <div className="sm:col-span-2">
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-foreground">
                {activeCategory ? activeCategory.name : "Tous les articles"}
              </h2>
              {articles.length === 0 ? (
                <EmptyState title="Aucun article" description="Revenez plus tard." />
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {articles.map((article) => (
                    <li key={article.id} className="py-3">
                      <Link href={`/help/${workspaceId}/articles/${article.slug}`} className="text-sm font-medium text-primary hover:underline">
                        {article.title}
                      </Link>
                      {article.meta_description && <p className="mt-1 text-sm text-muted">{article.meta_description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
