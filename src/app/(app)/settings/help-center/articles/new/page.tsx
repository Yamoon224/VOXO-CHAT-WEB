import { HelpCenterArticleForm } from "@/features/help-center/components/HelpCenterArticleForm";

export default function NewHelpCenterArticlePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Nouvel article</h1>
      <HelpCenterArticleForm />
    </div>
  );
}
