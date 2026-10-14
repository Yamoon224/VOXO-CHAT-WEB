export type ArticleStatus = "draft" | "published";

export type HelpCenterCategory = {
  id: string;
  name: string;
  slug: string;
  locale: "fr" | "en";
  position: number;
};

export type HelpCenterArticle = {
  id: string;
  title: string;
  slug: string;
  locale: "fr" | "en";
  body: string;
  status: ArticleStatus;
  status_label: string;
  meta_description: string | null;
  position: number;
  category: { id: string; name: string } | null;
  published_at: string | null;
  created_at: string;
};
