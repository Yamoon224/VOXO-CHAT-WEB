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

export type AgentToolHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AgentToolParameterType = "string" | "number" | "boolean";

export type AgentToolParameterLocation = "path" | "query" | "body";

export type AgentToolParameter = {
  name: string;
  type: AgentToolParameterType;
  description: string;
  required: boolean;
  in: AgentToolParameterLocation;
};

export type AgentTool = {
  id: string;
  name: string;
  description: string;
  http_method: AgentToolHttpMethod;
  url: string;
  headers: Record<string, string> | null;
  parameters: AgentToolParameter[];
  enabled: boolean;
  created_at: string | null;
};
