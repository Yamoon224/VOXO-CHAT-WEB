import { HelpCenterArticleForm } from "@/features/help-center/components/HelpCenterArticleForm";

export default async function EditHelpCenterArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Modifier l&apos;article</h1>
      <HelpCenterArticleForm articleId={id} />
    </div>
  );
}
