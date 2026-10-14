"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useHelpCenterArticleForm } from "@/features/help-center/components/useHelpCenterArticleForm";
import type { ArticleStatus } from "@/features/help-center/types";

const STATUS_OPTIONS: { value: ArticleStatus; label: string }[] = [
  { value: "draft", label: "Brouillon" },
  { value: "published", label: "Publié" },
];

const LOCALE_OPTIONS: { value: "fr" | "en"; label: string }[] = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
];

export function HelpCenterArticleForm({ articleId }: { articleId?: string }) {
  const {
    loadState,
    categories,
    title,
    setTitle,
    categoryId,
    setCategoryId,
    locale,
    setLocale,
    status,
    setStatus,
    metaDescription,
    setMetaDescription,
    body,
    setBody,
    isSubmitting,
    error,
    handleSubmit,
  } = useHelpCenterArticleForm(articleId);

  if (loadState.status === "loading") {
    return <p className="text-sm text-muted">Chargement…</p>;
  }

  if (loadState.status === "error") {
    return <Alert variant="error">{loadState.error.message}</Alert>;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Titre" required value={title} onChange={(event) => setTitle(event.target.value)} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="help-center-article-category" className="text-sm font-medium text-foreground">
            Catégorie
          </label>
          <select
            id="help-center-article-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            <option value="">Sans catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {!articleId && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="help-center-article-locale" className="text-sm font-medium text-foreground">
              Langue
            </label>
            <select
              id="help-center-article-locale"
              value={locale}
              onChange={(event) => setLocale(event.target.value as "fr" | "en")}
              className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
            >
              {LOCALE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="help-center-article-status" className="text-sm font-medium text-foreground">
            Statut
          </label>
          <select
            id="help-center-article-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as ArticleStatus)}
            className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Field
        label="Description (référencement)"
        value={metaDescription}
        onChange={(event) => setMetaDescription(event.target.value)}
        hint="Résumé affiché dans les résultats de recherche, 160 caractères maximum."
        maxLength={160}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="help-center-article-body" className="text-sm font-medium text-foreground">
          Contenu
        </label>
        <textarea
          id="help-center-article-body"
          required
          rows={16}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        />
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
