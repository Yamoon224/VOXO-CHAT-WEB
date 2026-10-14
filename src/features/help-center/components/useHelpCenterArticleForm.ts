import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as helpCenterApi from "@/features/help-center/api";
import { ApiError } from "@/lib/api/errors";
import type { ArticleStatus, HelpCenterCategory } from "@/features/help-center/types";

type LoadState = { status: "loading" } | { status: "error"; error: ApiError } | { status: "ready" };

/** Formulaire de création/modification d'un article — même écran pour les deux, `articleId` absent à la création. */
export function useHelpCenterArticleForm(articleId?: string) {
  const router = useRouter();
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [categories, setCategories] = useState<HelpCenterCategory[]>([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [status, setStatus] = useState<ArticleStatus>("draft");
  const [metaDescription, setMetaDescription] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const load = useCallback(async () => {
    try {
      const [categoriesResponse, articleResponse] = await Promise.all([
        helpCenterApi.listCategories(),
        articleId ? helpCenterApi.getArticle(articleId) : Promise.resolve(null),
      ]);
      setCategories(categoriesResponse.data);

      if (articleResponse) {
        const article = articleResponse.data;
        setTitle(article.title);
        setCategoryId(article.category?.id ?? "");
        setLocale(article.locale);
        setStatus(article.status);
        setMetaDescription(article.meta_description ?? "");
        setBody(article.body);
      }

      setLoadState({ status: "ready" });
    } catch (caught) {
      setLoadState({ status: "error", error: caught instanceof ApiError ? caught : ApiError.networkError() });
    }
  }, [articleId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      title,
      category_id: categoryId || null,
      locale,
      body,
      status,
      meta_description: metaDescription || null,
    };

    try {
      if (articleId) {
        await helpCenterApi.updateArticle(articleId, payload);
      } else {
        await helpCenterApi.createArticle(payload);
      }
      router.push("/settings/help-center");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
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
  };
}
