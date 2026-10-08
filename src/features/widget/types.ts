export type WidgetPosition = "bottom_right" | "bottom_left";

export type BusinessHourSlot = { day: number; opens_at: string; closes_at: string };

export type WidgetSettings = {
  primary_color: string;
  logo_url: string | null;
  position: WidgetPosition;
  welcome_message: string | null;
  language: "fr" | "en";
  business_hours: BusinessHourSlot[] | null;
  offline_message: string | null;
};
