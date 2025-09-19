import { Timestamp, ID, ApiResponse } from "./api.types";

// Base source interface - aligned with backend API
export interface BaseSource {
  id: number;
  agent_id: number;
  source_type: "file" | "text" | "website" | "database" | "qa";
  name: string;
  description?: string | null;
  status: SourceStatus;
  is_embedded: boolean;
  created_by: number;
  created_at: Timestamp;
  updated_by?: number | null;
  updated_at: Timestamp;
  is_deleted: boolean;
  deleted_by?: number | null;
  deleted_at?: Timestamp | null;
}

// File Source Types - Complete schema with joined source and file_sources table data
export interface FileSource {
  // Fields from sources table
  id: number;
  agent_id: number;
  source_type: "file";
  name: string;
  description?: string | null;
  status: SourceStatus;
  is_embedded: boolean;
  created_by: number;
  created_at: Timestamp;
  updated_by?: number | null;
  updated_at: Timestamp;
  is_deleted: boolean;
  deleted_by?: number | null;
  deleted_at?: Timestamp | null;
  // Fields from file_sources table
  source_id: number;
  file_url: string;
  mime_type?: string | null;
  file_size: number | string; // Accept int8 as string or number
  text_content?: string | null;
}

export interface FileSourceUploadRequest {
  agent_id: number;
  name: string;
  description?: string;
  file: File; // Actual File object for multipart/form-data
}

export interface MultipleFilesUploadRequest {
  agent_id: number;
  files: File[];
  names: string[];
  descriptions?: string[];
}

export interface UpdateFileSourceRequest {
  file_url?: string;
  mime_type?: string;
  file_size?: number;
  text_content?: string;
}

// Text Source Types - Complete schema with joined source and text_sources table data
export interface TextSource {
  // Fields from sources table
  id: number;
  agent_id: number;
  source_type: "text";
  name: string;
  description?: string | null;
  status: SourceStatus;
  is_embedded: boolean;
  created_by: number;
  created_at: Timestamp;
  updated_by?: number | null;
  updated_at: Timestamp;
  is_deleted: boolean;
  deleted_by?: number | null;
  deleted_at?: Timestamp | null;
  // Fields from text_sources table
  source_id: number;
  content: string;
}

export interface CreateTextSourceRequest {
  agent_id: number;
  name: string;
  description?: string;
  content: string;
}

export interface UpdateTextSourceRequest {
  content?: string;
}

// QA Source Types
export interface QAPair {
  question: string;
  answer: string;
}

export interface QASource {
  // Fields from sources table
  id: number;
  agent_id: number;
  source_type: "qa";
  name: string;
  description?: string | null;
  status: SourceStatus;
  is_embedded: boolean;
  created_by: number;
  created_at: Timestamp;
  updated_by?: number | null;
  updated_at: Timestamp;
  is_deleted: boolean;
  deleted_by?: number | null;
  deleted_at?: Timestamp | null;
  // Fields from qa_sources table
  source_id: number;
  question: string;
  answer: string;
}

export interface CreateQASourceRequest {
  agent_id: number;
  name?: string;
  description?: string;
  qa_pairs: QAPair[];
}

export interface UpdateQASourceRequest {
  question?: string;
  answer?: string;
}

// Website Source Types - Complete schema with joined source and website_sources table data
export interface WebsiteSource {
  // Fields from sources table
  id: number;
  agent_id: number;
  source_type: "website";
  name: string;
  description?: string | null;
  status: SourceStatus;
  is_embedded: boolean;
  created_by: number;
  created_at: Timestamp;
  updated_by?: number | null;
  updated_at: Timestamp;
  is_deleted: boolean;
  deleted_by?: number | null;
  deleted_at?: Timestamp | null;
  // Fields from website_sources table
  source_id: number;
  url: string;
  crawl_depth: number;
  page_count?: number;
  last_crawled?: Timestamp | null;
}

export interface CreateWebsiteSourceRequest {
  agent_id: number;
  name: string;
  description?: string;
  url: string;
  crawl_depth?: number;
}

export interface UpdateWebsiteSourceRequest {
  url?: string;
  crawl_depth?: number;
  page_count?: number;
  last_crawled?: Timestamp;
}

// Form types for UI components
export interface WebsiteSourceForm {
  name: string; // Required - text input
  description?: string; // Optional - textarea
  url: string; // Required - URL input with validation
  crawl_depth?: number; // Optional - number input (1-10), default 1
}

// Database Source Types
export interface DatabaseSource extends BaseSource {
  type: "database";
  connectionString: string;
  query?: string;
  tables?: string[];
  lastSynced?: Timestamp;
  recordCount?: number;
}

// File Source as legacy DataSource type (for compatibility)
export interface FileLegacySource extends BaseSource {
  type: "file";
  metadata?: {
    size?: number;
    contentType?: string;
  };
}

// Source status types - aligned with backend API
export type SourceStatus = "pending" | "processing" | "completed" | "failed";

// For backward compatibility, create DataSource type using BaseSource
export type DataSource = BaseSource & {
  name?: string; // For UI display purposes
  type: BaseSource["source_type"]; // Alias for consistency
  metadata?: Record<string, any>; // Parsed processing_metadata

  // Legacy properties for specific source types
  pageCount?: number; // For website sources
  recordCount?: number; // For database sources
  questions?: Array<{ question: string; answer: string; category?: string }>; // For QA sources
};

// Base source API request types
export interface CreateSourceRequest {
  agent_id: number;
  source_type: "file" | "text" | "website" | "database" | "qa";
  name: string;
  description?: string;
}

export interface UpdateSourceRequest {
  name?: string;
  description?: string;
  status?: SourceStatus;
  is_embedded?: boolean;
}

// API Response Types
export type BaseSourceResponse = ApiResponse<BaseSource>;
export type BaseSourcesResponse = ApiResponse<BaseSource[]>;
export type FileSourceResponse = ApiResponse<FileSource>;
export type FileSourcesResponse = ApiResponse<FileSource[]>;
export type TextSourceResponse = ApiResponse<TextSource>;
export type TextSourcesResponse = ApiResponse<TextSource[]>;
export type WebsiteSourceResponse = ApiResponse<WebsiteSource>;
export type WebsiteSourcesResponse = ApiResponse<WebsiteSource[]>;
export type QASourceResponse = ApiResponse<QASource>;
export type QASourcesResponse = ApiResponse<QASource[]>;

export interface WebsiteSourceRequest {
  name: string;
  url: string;
  crawlDepth?: number;
  includePatterns?: string[];
  excludePatterns?: string[];
}

export interface DatabaseSourceRequest {
  name: string;
  connectionString: string;
  query?: string;
  tables?: string[];
}

export interface QASourceRequest {
  name: string;
  questions: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
}
