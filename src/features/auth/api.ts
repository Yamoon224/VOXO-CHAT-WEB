import { apiFetch } from "@/lib/api/client";
import type { IssuedSession, Session } from "@/features/auth/types";

type Envelope<T> = { data: T };

export function register(input: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  workspace_name: string;
}): Promise<Envelope<IssuedSession>> {
  return apiFetch("/auth/register", { method: "POST", body: input, withAuth: false });
}

export function login(input: { email: string; password: string; code?: string }): Promise<Envelope<IssuedSession>> {
  return apiFetch("/auth/login", { method: "POST", body: input, withAuth: false });
}

export function logout(): Promise<void> {
  return apiFetch("/auth/logout", { method: "POST" });
}

export function me(): Promise<Envelope<Session>> {
  return apiFetch("/auth/me");
}

export function verifyEmail(token: string): Promise<Envelope<{ email: string; email_verified: boolean }>> {
  return apiFetch("/auth/email/verify", { method: "POST", body: { token }, withAuth: false });
}

export function resendVerificationEmail(): Promise<void> {
  return apiFetch("/auth/email/resend", { method: "POST" });
}

export function requestPasswordReset(email: string): Promise<void> {
  return apiFetch("/auth/password/forgot", { method: "POST", body: { email }, withAuth: false });
}

export function resetPassword(input: {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}): Promise<void> {
  return apiFetch("/auth/password/reset", { method: "POST", body: input, withAuth: false });
}
