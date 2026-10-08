import { apiFetch } from "@/lib/api/client";
import type { WidgetSettings } from "@/features/widget/types";

export function getSettings(): Promise<{ data: WidgetSettings }> {
  return apiFetch("/workspace/widget/settings");
}

export function updateSettings(payload: Partial<WidgetSettings>): Promise<{ data: WidgetSettings }> {
  return apiFetch("/workspace/widget/settings", { method: "PUT", body: payload });
}

export function getScript(): Promise<{ data: { script: string } }> {
  return apiFetch("/workspace/widget/script");
}
