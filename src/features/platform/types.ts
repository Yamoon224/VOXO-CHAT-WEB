import type { SubscriptionStatus } from "@/features/billing/types";

export type PlatformWorkspace = {
  id: string;
  name: string;
  slug: string;
  created_at: string | null;
  member_count: number;
  plan_slug: string | null;
  plan_name: string | null;
  subscription_status: SubscriptionStatus | null;
  current_period_end: string | null;
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export type PaginatedPlatformWorkspaces = { data: PlatformWorkspace[]; meta: PaginationMeta };
