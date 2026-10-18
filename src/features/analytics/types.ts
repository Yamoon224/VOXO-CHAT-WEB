export type AnalyticsCountByAgent = { user_id: string; count: number };
export type AnalyticsCountByChannel = { channel: string; count: number };
export type AnalyticsTopCitedDocument = { title: string; count: number };
export type AnalyticsUnansweredKnowledgeQuestion = { question: string; created_at: string };

export type AnalyticsOverview = {
  from: string;
  to: string;
  conversation_count: number;
  message_count: number;
  average_rating: number | null;
  ai_resolved_count: number;
  escalated_count: number;
  unanswered_count: number;
  average_first_response_seconds: number | null;
  average_resolution_seconds: number | null;
  messages_by_agent: AnalyticsCountByAgent[];
  conversations_by_channel: AnalyticsCountByChannel[];
  top_cited_documents: AnalyticsTopCitedDocument[];
  unanswered_knowledge_questions_count: number;
  recent_unanswered_knowledge_questions: AnalyticsUnansweredKnowledgeQuestion[];
};
