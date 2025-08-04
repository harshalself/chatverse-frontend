import { Timestamp, ID, ApiResponse } from "./api.types";

// Base source interface - aligned with backend API
export interface BaseSource {
  id: number;
  agent_id: number;
  source_type: "file" | "text" | "website" | "database" | "qa";
  status: SourceStatus;
  processing_metadata?: string | null;
  is_embedded: boolean;
  last_processed?: Timestamp | null;
  created_by: number;
  created_at: Timestamp;
  updated_by?: number | null;
  updated_at: Timestamp;
  is_deleted: boolean;
  deleted_by?: number | null;
  deleted_at?: Timestamp | null;
}

// File Source Types
export interface FileSource {
  id: number;
  agent_id: number;
  name: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface FileSourceUploadRequest {
  agent_id: number;
  name: string;
  file: File; // File object for FormData
}

export interface MultipleFilesUploadRequest {
  agent_id: number;
  files: File[];
  names?: string[]; // Optional array of custom names
}

// Text Source Types
export interface TextSource extends BaseSource {
  type: "text";
  content: string;
  metadata?: Record<string, any>;
}

// Website Source Types
export interface WebsiteSource extends BaseSource {
  type: "website";
  url: string;
  crawlDepth?: number;
  includePatterns?: string[];
  excludePatterns?: string[];
  lastCrawled?: Timestamp;
  pageCount?: number;
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

// Q&A Source Types
export interface QASource extends BaseSource {
  type: "qa";
  questions: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
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
  processing_metadata?: string;
}

export interface UpdateSourceRequest {
  status?: SourceStatus;
  processing_metadata?: string;
  is_embedded?: boolean;
}

// API Response Types
export type BaseSourceResponse = ApiResponse<BaseSource>;
export type BaseSourcesResponse = ApiResponse<BaseSource[]>;

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
