export type Contact = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  custom_attributes: Record<string, string>;
  created_at: string | null;
};

export type ContactWriteInput = {
  name: string | null;
  email: string | null;
  phone: string | null;
  custom_attributes: Record<string, string> | null;
};

export type ContactNote = {
  id: string;
  body: string;
  author_name: string | null;
  created_at: string | null;
};

export type ContactEvent = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  occurred_at: string;
};

export type SegmentOperator = "equals" | "contains" | "is_set" | "is_not_set";

export type SegmentCriterion = {
  field: string;
  operator: SegmentOperator;
  value: string | null;
};

export type ContactSegment = {
  id: string;
  name: string;
  criteria: SegmentCriterion[];
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export type PaginatedContacts = { data: Contact[]; meta: PaginationMeta };

export type ImportSummary = { created: number; updated: number };
