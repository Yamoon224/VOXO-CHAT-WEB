import { ConversationListPage } from "@/features/conversations/components/ConversationListPage";

export default function ConversationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Conversations</h1>
      <ConversationListPage />
    </div>
  );
}
