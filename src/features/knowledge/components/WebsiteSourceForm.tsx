"use client";

import { Alert, Button, Field } from "@/components/ui";
import { useWebsiteSourceForm } from "@/features/knowledge/components/useWebsiteSourceForm";
import type { RecrawlFrequency } from "@/features/knowledge/types";

const FREQUENCY_OPTIONS: { value: RecrawlFrequency; label: string }[] = [
  { value: "manual", label: "Manuelle" },
  { value: "daily", label: "Quotidienne" },
  { value: "weekly", label: "Hebdomadaire" },
];

export function WebsiteSourceForm({
  create,
}: {
  create: (payload: { name?: string; url: string; sitemapUrl?: string; recrawlFrequency: RecrawlFrequency }) => Promise<void>;
}) {
  const {
    name,
    setName,
    url,
    setUrl,
    sitemapUrl,
    setSitemapUrl,
    recrawlFrequency,
    setRecrawlFrequency,
    isSubmitting,
    error,
    handleSubmit,
  } = useWebsiteSourceForm(create);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {error && <Alert variant="error">{error.message}</Alert>}

      <Field label="Nom (optionnel)" name="website-name" value={name} onChange={(event) => setName(event.target.value)} />

      <Field
        label="URL du site"
        type="url"
        name="url"
        required
        placeholder="https://exemple.com"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        error={error?.fieldError("url")}
      />

      <Field
        label="Plan de site (optionnel)"
        type="url"
        name="sitemap-url"
        placeholder="https://exemple.com/sitemap.xml"
        value={sitemapUrl}
        onChange={(event) => setSitemapUrl(event.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="recrawl-frequency" className="text-sm font-medium text-foreground">
          Ré-indexation planifiée
        </label>
        <select
          id="recrawl-frequency"
          value={recrawlFrequency}
          onChange={(event) => setRecrawlFrequency(event.target.value as RecrawlFrequency)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground"
        >
          {FREQUENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Button type="submit" isLoading={isSubmitting}>
          Explorer le site
        </Button>
      </div>
    </form>
  );
}
