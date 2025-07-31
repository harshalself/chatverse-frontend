import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { DataSource } from "@/types/source.types";
import { PaginatedResponse, PaginationOptions } from "@/types/api.types";

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

/**
 * Base sources service with common functionality for all source types
 */
export class BaseSourcesService {
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
