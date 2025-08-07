import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  TextSource,
  CreateTextSourceRequest,
  UpdateTextSourceRequest,
  TextSourceResponse,
  TextSourcesResponse,
} from "@/types/source.types";

/**
 * Text sources service for handling text-based sources
 */
export class TextSourcesService {
  /**
   * Create a new text source
   */
  static async createTextSource(
    request: CreateTextSourceRequest
  ): Promise<TextSource> {
    const response = await apiClient.post<TextSourceResponse>(
      API_ENDPOINTS.SOURCES.TEXT.CREATE,
      request
    );
    // Return response.data.data if present, else response.data if it looks like a TextSource, else empty object
    const d: any = response.data?.data || response.data;
    return d &&
      typeof d === "object" &&
      "id" in d &&
      "agent_id" in d &&
      "name" in d &&
      "content" in d
      ? (d as TextSource)
      : ({} as TextSource);
  }

  /**
   * Get all text sources for an agent
   */
  static async getTextSources(agentId: number): Promise<TextSource[]> {
    const response = await apiClient.get<TextSourcesResponse>(
      API_ENDPOINTS.SOURCES.TEXT.GET_ALL(agentId)
    );
    // Always return an array, even if backend returns null/undefined
    return response.data?.data || [];
  }

  /**
   * Get a single text source by ID
   */
  static async getTextSource(id: number): Promise<TextSource> {
    const response = await apiClient.get<TextSourceResponse>(
      API_ENDPOINTS.SOURCES.TEXT.GET(id)
    );
    return response.data.data;
  }

  /**
   * Update a text source
   */
  static async updateTextSource(
    id: number,
    request: UpdateTextSourceRequest
  ): Promise<TextSource> {
    const response = await apiClient.put<TextSourceResponse>(
      API_ENDPOINTS.SOURCES.TEXT.UPDATE(id),
      request
    );
    return response.data.data;
  }

  /**
   * Delete a text source
   */
  static async deleteTextSource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.TEXT.DELETE(id));
  }
}
