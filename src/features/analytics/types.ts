export type AnalyticsOverview = {
  from: string;
  to: string;
  conversation_count: number;
  message_count: number;
  average_rating: number | null;
  ai_resolved_count: number;
  escalated_count: number;
  unanswered_count: number;
};
