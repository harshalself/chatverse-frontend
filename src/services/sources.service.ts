import { apiClient, TokenManager } from "@/lib/api/client";
import { API_ENDPOINTS, APP_CONFIG } from "@/lib/constants";
import { DataSource } from "@/types/common.types";
import { PaginatedResponse, PaginationOptions } from "@/types/api.types";
import axios from "axios";

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

export class SourcesService {
  /**
   * Get all sources with pagination and filtering
   */
  static async getSources(
    options?: PaginationOptions
  ): Promise<PaginatedResponse<DataSource>> {
    const params = new URLSearchParams();

    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.sort?.field) params.append("sortBy", options.sort.field);
    if (options?.sort?.direction)
      params.append("sortOrder", options.sort.direction);
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.SOURCES.LIST}?${queryString}`
      : API_ENDPOINTS.SOURCES.LIST;

    return (await apiClient.get(url)) as PaginatedResponse<DataSource>;
  }

  /**
   * Get single source by ID
   */
  static async getSource(id: string): Promise<DataSource> {
    return (await apiClient.get(API_ENDPOINTS.SOURCES.GET(id))) as DataSource;
  }

  /**
   * Create new text source
   */
  static async createTextSource(
    data: CreateSourceRequest
  ): Promise<DataSource> {
    return (await apiClient.post(API_ENDPOINTS.SOURCES.CREATE, {
      ...data,
      type: "text",
    })) as DataSource;
  }

  /**
   * Create website source
   */
  static async createWebsiteSource(
    data: WebsiteSourceRequest
  ): Promise<DataSource> {
    return (await apiClient.post(API_ENDPOINTS.SOURCES.CREATE, {
      ...data,
      type: "website",
    })) as DataSource;
  }

  /**
   * Create database source
   */
  static async createDatabaseSource(
    data: DatabaseSourceRequest
  ): Promise<DataSource> {
    return (await apiClient.post(API_ENDPOINTS.SOURCES.CREATE, {
      ...data,
      type: "database",
    })) as DataSource;
  }

  /**
   * Create Q&A source
   */
  static async createQASource(data: QASourceRequest): Promise<DataSource> {
    return (await apiClient.post(API_ENDPOINTS.SOURCES.CREATE, {
      ...data,
      type: "qa",
    })) as DataSource;
  }

  /**
   * Upload file source
   */
  static async uploadFile(
    file: File,
    name?: string,
    onProgress?: (progress: number) => void
  ): Promise<DataSource> {
    const formData = new FormData();
    formData.append("file", file);
    if (name) formData.append("name", name);

    const response = await axios.post(
      `${APP_CONFIG.apiBaseUrl}${API_ENDPOINTS.SOURCES.UPLOAD}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${TokenManager.getToken()} public`,
        },
        onUploadProgress: onProgress
          ? (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              onProgress(progress);
            }
          : undefined,
      }
    );
    return response.data;
  }

  /**
   * Upload multiple files
   */
  static async uploadMultipleFiles(
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<DataSource[]> {
    const results: DataSource[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await this.uploadFile(file, file.name, (progress) =>
        onProgress?.(i, progress)
      );
      results.push(result);
    }

    return results;
  }

  /**
   * Update existing source
   */
  static async updateSource(
    id: string,
    data: UpdateSourceRequest
  ): Promise<DataSource> {
    return (await apiClient.put(
      API_ENDPOINTS.SOURCES.UPDATE(id),
      data
    )) as DataSource;
  }

  /**
   * Delete source
   */
  static async deleteSource(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.DELETE(id));
  }

  /**
   * Process source (extract content, index, etc.)
   */
  static async processSource(id: string): Promise<{ taskId: string }> {
    return (await apiClient.post(`/sources/${id}/process`)) as {
      taskId: string;
    };
  }

  /**
   * Get source processing status
   */
  static async getProcessingStatus(
    id: string,
    taskId: string
  ): Promise<{
    status: "pending" | "processing" | "completed" | "failed";
    progress: number;
    message?: string;
    extractedContent?: string;
  }> {
    return apiClient.get(`/sources/${id}/process/${taskId}/status`);
  }

  /**
   * Test website connection
   */
  static async testWebsiteConnection(url: string): Promise<{
    accessible: boolean;
    statusCode: number;
    title?: string;
    description?: string;
    error?: string;
  }> {
    return apiClient.post("/sources/test-website", { url });
  }

  /**
   * Test database connection
   */
  static async testDatabaseConnection(connectionString: string): Promise<{
    connected: boolean;
    tables?: string[];
    error?: string;
  }> {
    return apiClient.post("/sources/test-database", { connectionString });
  }

  /**
   * Get source content preview
   */
  static async getSourcePreview(
    id: string,
    maxLength = 1000
  ): Promise<{
    content: string;
    totalLength: number;
    excerpt: boolean;
  }> {
    return apiClient.get(`/sources/${id}/preview?maxLength=${maxLength}`);
  }

  /**
   * Search within sources
   */
  static async searchSources(
    query: string,
    sourceIds?: string[],
    options?: PaginationOptions
  ): Promise<
    PaginatedResponse<{
      source: DataSource;
      matches: Array<{
        content: string;
        score: number;
        highlights: string[];
      }>;
    }>
  > {
    const params = new URLSearchParams();
    params.append("q", query);

    if (sourceIds?.length) {
      sourceIds.forEach((id) => params.append("sourceIds", id));
    }

    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());

    return apiClient.get(`/sources/search?${params.toString()}`);
  }

  /**
   * Get sources by type
   */
  static async getSourcesByType(
    type: DataSource["type"],
    options?: PaginationOptions
  ): Promise<PaginatedResponse<DataSource>> {
    return this.getSources({
      ...options,
      filter: { ...options?.filter, type },
    });
  }

  /**
   * Bulk delete sources
   */
  static async bulkDeleteSources(ids: string[]): Promise<{
    deleted: string[];
    failed: Array<{ id: string; error: string }>;
  }> {
    return apiClient.post("/sources/bulk-delete", { ids });
  }

  /**
   * Export source data
   */
  static async exportSource(
    id: string,
    format: "json" | "csv" | "txt" = "json"
  ): Promise<Blob> {
    const response = await axios.get(
      `${APP_CONFIG.apiBaseUrl}/sources/${id}/export?format=${format}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${TokenManager.getToken()} public`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get source statistics
   */
  static async getSourceStatistics(): Promise<{
    total: number;
    byType: Record<DataSource["type"], number>;
    byStatus: Record<DataSource["status"], number>;
    totalSize: number;
    lastUpdated: string;
  }> {
    return apiClient.get("/sources/statistics");
  }
}
