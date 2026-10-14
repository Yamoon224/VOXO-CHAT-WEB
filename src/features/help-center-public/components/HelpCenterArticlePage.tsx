"use client";

import Link from "next/link";
import { Alert, Card, Spinner } from "@/components/ui";
import { useHelpCenterArticlePage } from "@/features/help-center-public/components/useHelpCenterArticlePage";

/** Écran `/help/[workspace]/articles/[slug]` : un article publié, jamais un brouillon (404 sinon). */
export function HelpCenterArticlePage({ workspaceId, slug }: { workspaceId: string; slug: string }) {
  const { loadState, article } = useHelpCenterArticlePage(workspaceId, slug);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <Link href={`/help/${workspaceId}`} className="text-sm font-medium text-primary hover:underline">
        ← Centre d&apos;aide
      </Link>

      {loadState.status === "loading" && (
        <div className="flex items-center gap-2 text-sm text-muted">
          <Spinner size="sm" />
          Chargement…
        </div>
      )}

      {loadState.status === "error" && <Alert variant="error">{loadState.error.message}</Alert>}

      {loadState.status === "ready" && article && (
        <Card>
          {article.category && <p className="mb-2 text-sm text-muted">{article.category.name}</p>}
          <h1 className="text-xl font-semibold text-foreground">{article.title}</h1>
          <div className="mt-4 whitespace-pre-wrap text-sm text-foreground">{article.body}</div>
        </Card>
      )}
    </div>
  );
}
