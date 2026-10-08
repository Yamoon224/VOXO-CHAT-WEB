import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { RecrawlFrequency } from "@/features/knowledge/types";

type CreateWebsiteSource = (payload: { name?: string; url: string; sitemapUrl?: string; recrawlFrequency: RecrawlFrequency }) => Promise<void>;

export function useWebsiteSourceForm(create: CreateWebsiteSource) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [recrawlFrequency, setRecrawlFrequency] = useState<RecrawlFrequency>("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await create({
        name: name || undefined,
        url,
        sitemapUrl: sitemapUrl || undefined,
        recrawlFrequency,
      });
      setName("");
      setUrl("");
      setSitemapUrl("");
      setRecrawlFrequency("manual");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
