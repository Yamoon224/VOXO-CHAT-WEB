import { apiFetch } from "@/lib/api/client";
import type { Locale, SessionUser } from "@/features/auth/types";

export function updateProfile(input: { name?: string; locale?: Locale }): Promise<{ data: SessionUser }> {
  return apiFetch("/profile", { method: "PUT", body: input });
}

export function updatePassword(input: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  return apiFetch("/profile/password", { method: "PUT", body: input });
}
