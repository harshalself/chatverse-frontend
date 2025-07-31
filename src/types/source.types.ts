import { Timestamp, ID } from "./api.types";

// Base source interface
export interface BaseSource {
  id: ID;
  name: string;
  status: SourceStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
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

// Combined type for all sources
export type DataSource =
  | TextSource
  | WebsiteSource
  | DatabaseSource
  | QASource
  | FileLegacySource;

// Source status types
export type SourceStatus = "pending" | "processing" | "ready" | "error";

// Source API Request Types
export interface CreateSourceRequest {
  name: string;
  type: "file" | "text" | "website" | "database" | "qa";
  content?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSourceRequest {
  name?: string;
  content?: string;
  metadata?: Record<string, any>;
}

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
