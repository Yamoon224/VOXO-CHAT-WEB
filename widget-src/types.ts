export type WidgetSettings = {
  primary_color: string;
  logo_url: string | null;
  position: "bottom_right" | "bottom_left";
  welcome_message: string | null;
  language: string;
  is_open_now: boolean;
  offline_message: string | null;
  hide_branding: boolean;
  realtime: { key: string; host: string; port: number; scheme: string } | null;
};

export type WidgetMessage = {
  id: string;
  sender_type: "visitor" | "agent" | "ai" | "system";
  body: string;
  citations: { title: string; content: string; citation_url: string | null }[];
  created_at: string | null;
};

export type Session = { token: string; visitorId: string };
