export type AssistantSettings = {
  enabled: boolean;
  tone_instructions: string | null;
  confidence_threshold: number;
};

export type AiReply = {
  content: string;
  citations: { title: string; content: string; citation_url: string | null }[];
  confidence: number;
};
