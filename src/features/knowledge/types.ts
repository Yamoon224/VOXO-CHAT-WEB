export type KnowledgeSourceType = "upload" | "website" | "manual";

export type KnowledgeDocumentType = "file" | "website_page" | "qa";

export type KnowledgeDocumentStatus = "pending" | "processing" | "indexed" | "failed";

export type RecrawlFrequency = "manual" | "daily" | "weekly";

export type KnowledgeSource = {
  id: string;
  type: KnowledgeSourceType;
  type_label: string;
  name: string;
  website_url: string | null;
  website_sitemap_url: string | null;
  recrawl_frequency: RecrawlFrequency;
  last_crawled_at: string | null;
  created_at: string;
};

export type KnowledgeDocument = {
  id: string;
  source_id: string;
  type: KnowledgeDocumentType;
  type_label: string;
  title: string;
  origin_url: string | null;
  original_filename: string | null;
  mime_type: string | null;
  status: KnowledgeDocumentStatus;
  status_label: string;
  status_message: string | null;
  chunk_count: number;
  indexed_at: string | null;
  created_at: string;
};

export type KnowledgeQaEntry = {
  id: string;
  question: string;
  answer: string;
  status: KnowledgeDocumentStatus;
  status_label: string;
  chunk_count: number;
  created_at: string;
};

export type KnowledgeSearchResult = {
  document_id: string;
  document_title: string;
  chunk_content: string;
  score: number;
  citation_url: string | null;
};

type PaginationMeta = { current_page: number; last_page: number; per_page: number; total: number };

export type PaginatedSources = { data: KnowledgeSource[]; meta: PaginationMeta };
export type PaginatedDocuments = { data: KnowledgeDocument[]; meta: PaginationMeta };
export type PaginatedQaEntries = { data: KnowledgeQaEntry[]; meta: PaginationMeta };
