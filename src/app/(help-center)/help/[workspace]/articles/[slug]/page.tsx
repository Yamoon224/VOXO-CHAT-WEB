import { HelpCenterArticlePage } from "@/features/help-center-public/components/HelpCenterArticlePage";

export default async function HelpCenterArticleRoutePage({ params }: { params: Promise<{ workspace: string; slug: string }> }) {
  const { workspace, slug } = await params;

  return <HelpCenterArticlePage workspaceId={workspace} slug={slug} />;
}
