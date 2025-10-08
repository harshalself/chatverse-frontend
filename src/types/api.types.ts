// Common API Response Types - Aligned with backend API structure
// The API client automatically converts new standardized format to this legacy format
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
    [key: string]: any;
  };
  // Optional success field for new code that wants to check it
  success?: boolean;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  details?: any;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Request/Response Status
export type RequestStatus = "idle" | "loading" | "success" | "error";

// Common ID type
export type ID = string;

// Timestamp type
export type Timestamp = string; // ISO 8601 format

// File Upload Types
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  id?: string;
}

// Note: File Source API Types are now in source.types.ts

// Note: FileSourceUploadRequest and MultipleFilesUploadRequest are now in source.types.ts

// Sort and Filter Types
export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterOptions {
  [key: string]: any;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: SortOptions;
  filter?: FilterOptions;
}

// Provider Model Response Types
export interface ProviderModelResponse {
  data: import("./common.types").ProviderModel;
  message: string;
}

export interface ProviderModelsResponse {
  data: import("./common.types").ProviderModel[];
  message: string;
}
