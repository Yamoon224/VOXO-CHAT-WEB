"use client";

import { Alert, Card, Spinner } from "@/components/ui";
import { useSession } from "@/lib/auth/session-context";
import { useConversationDetailPage } from "@/features/conversations/components/useConversationDetailPage";
import { MessageThread } from "@/features/conversations/components/MessageThread";
import { ReplyForm } from "@/features/conversations/components/ReplyForm";
import { ConversationSidebarPanel } from "@/features/conversations/components/ConversationSidebarPanel";

export function ConversationDetailPage({ conversationId }: { conversationId: string }) {
  const { session } = useSession();
  const { loadState, conversation, messages, members, cannedResponses, actionError, changeStatus, assign, reply, summarize, analyzeSentiment } =
    useConversationDetailPage(conversationId);

  const canManage = session?.permissions.includes("conversations.manage") ?? false;

  if (loadState.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Spinner size="sm" />
        Chargement de la conversation…
      </div>
    );
  }

  if (loadState.status === "error" || conversation === null) {
    return <Alert variant="error">{loadState.status === "error" ? loadState.error.message : "Conversation introuvable."}</Alert>;
  }

  return (
    <div className="flex flex-col gap-6">
      {actionError && <Alert variant="error">{actionError.message}</Alert>}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <MessageThread messages={messages} />
          </Card>

          {canManage && (
            <Card>
              <ReplyForm cannedResponses={cannedResponses} onSubmit={reply} />
            </Card>
          )}
        </div>

        <ConversationSidebarPanel
          conversation={conversation}
          members={members}
          canManage={canManage}
          onChangeStatus={changeStatus}
          onAssign={assign}
          onSummarize={summarize}
          onAnalyzeSentiment={analyzeSentiment}
        />
      </div>
    </div>
  );
}
