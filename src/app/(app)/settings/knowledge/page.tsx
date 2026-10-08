import { KnowledgePage } from "@/features/knowledge/components/KnowledgePage";

export default function SettingsKnowledgePage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Base de connaissances</h1>
      <KnowledgePage />
    </div>
  );
}
