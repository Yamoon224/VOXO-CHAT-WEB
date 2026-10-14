export type PublicHelpCenterCategory = {
  id: string;
  name: string;
  slug: string;
  locale: "fr" | "en";
  position: number;
};

export type PublicHelpCenterArticle = {
  id: string;
  title: string;
  slug: string;
  locale: "fr" | "en";
  body: string;
  meta_description: string | null;
  category: { id: string; name: string; slug: string } | null;
  published_at: string | null;
};
