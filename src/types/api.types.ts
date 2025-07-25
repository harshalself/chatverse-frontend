// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
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
