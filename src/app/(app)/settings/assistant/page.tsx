import { AssistantSettingsPage } from "@/features/assistant/components/AssistantSettingsPage";

export default function SettingsAssistantPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Agent IA</h1>
      <AssistantSettingsPage />
    </div>
  );
}
