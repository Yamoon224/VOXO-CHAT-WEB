import { apiFetch } from "@/lib/api/client";
import type { PublicHelpCenterArticle, PublicHelpCenterCategory } from "@/features/help-center-public/types";

/** Pages publiques du centre d'aide (section 2.10) : jamais de jeton Sanctum. */
export function listCategories(workspaceId: string): Promise<{ data: PublicHelpCenterCategory[] }> {
  return apiFetch(`/public/help-center/${workspaceId}/categories`, { withAuth: false });
}

export function listArticles(workspaceId: string, categoryId?: string): Promise<{ data: PublicHelpCenterArticle[] }> {
  return apiFetch(`/public/help-center/${workspaceId}/articles`, {
    query: { category_id: categoryId },
    withAuth: false,
  });
}

export function getArticle(workspaceId: string, slug: string): Promise<{ data: PublicHelpCenterArticle }> {
  return apiFetch(`/public/help-center/${workspaceId}/articles/${slug}`, { withAuth: false });
}
