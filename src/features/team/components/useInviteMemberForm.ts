import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api/errors";
import type { AssignableWorkspaceRole } from "@/features/auth/types";

export function useInviteMemberForm(invite: (email: string, role: AssignableWorkspaceRole) => Promise<void>) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AssignableWorkspaceRole>("agent");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await invite(email, role);
      setEmail("");
      setRole("agent");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught : ApiError.networkError());
    } finally {
      setIsSubmitting(false);
    }
  }

  return { email, setEmail, role, setRole, isSubmitting, error, handleSubmit };
}
