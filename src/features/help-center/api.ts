import { apiFetch } from "@/lib/api/client";
import type { ArticleStatus, HelpCenterArticle, HelpCenterCategory } from "@/features/help-center/types";

export function listCategories(): Promise<{ data: HelpCenterCategory[] }> {
  return apiFetch("/workspace/help-center/categories");
}

export function createCategory(name: string, position: number): Promise<{ data: HelpCenterCategory }> {
  return apiFetch("/workspace/help-center/categories", { method: "POST", body: { name, position } });
}

export function updateCategory(id: string, name: string, position: number): Promise<{ data: HelpCenterCategory }> {
  return apiFetch(`/workspace/help-center/categories/${id}`, { method: "PUT", body: { name, position } });
}

export function deleteCategory(id: string): Promise<void> {
  return apiFetch(`/workspace/help-center/categories/${id}`, { method: "DELETE" });
}

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export function listArticles(filters: { status?: ArticleStatus | "" } = {}): Promise<{ data: HelpCenterArticle[]; meta: PaginationMeta }> {
  return apiFetch("/workspace/help-center/articles", { query: { status: filters.status || undefined } });
}

export function getArticle(id: string): Promise<{ data: HelpCenterArticle }> {
  return apiFetch(`/workspace/help-center/articles/${id}`);
}

export type ArticlePayload = {
  title: string;
  category_id: string | null;
  locale?: "fr" | "en";
  body: string;
  status: ArticleStatus;
  meta_description: string | null;
};

export function createArticle(payload: ArticlePayload): Promise<{ data: HelpCenterArticle }> {
  return apiFetch("/workspace/help-center/articles", { method: "POST", body: payload });
}

export function updateArticle(id: string, payload: ArticlePayload): Promise<{ data: HelpCenterArticle }> {
  return apiFetch(`/workspace/help-center/articles/${id}`, { method: "PUT", body: payload });
}

export function deleteArticle(id: string): Promise<void> {
  return apiFetch(`/workspace/help-center/articles/${id}`, { method: "DELETE" });
}
