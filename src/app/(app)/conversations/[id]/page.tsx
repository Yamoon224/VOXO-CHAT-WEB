import { ConversationDetailPage } from "@/features/conversations/components/ConversationDetailPage";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-foreground">Conversation</h1>
      <ConversationDetailPage conversationId={id} />
    </div>
  );
}
