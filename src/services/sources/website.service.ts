import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  WebsiteSource,
  CreateWebsiteSourceRequest,
  UpdateWebsiteSourceRequest,
  WebsiteSourceResponse,
  WebsiteSourcesResponse,
} from "@/types/source.types";

/**
 * Website sources service for handling website-based sources
 */
export class WebsiteSourcesService {
  /**
   * Create a new website source
   */
  static async createWebsiteSource(
    request: CreateWebsiteSourceRequest
  ): Promise<WebsiteSource> {
    const response = await apiClient.post<WebsiteSourceResponse>(
      API_ENDPOINTS.SOURCES.WEBSITE.CREATE,
      request
    );
    // Return response.data.data if present, else response.data if it looks like a WebsiteSource, else empty object
    const d: unknown = response.data?.data || response.data;
    return d &&
      typeof d === "object" &&
      "id" in d &&
      "agent_id" in d &&
      "name" in d &&
      "url" in d
      ? (d as WebsiteSource)
      : ({} as WebsiteSource);
  }

  /**
   * Get all website sources for an agent
   */
  static async getWebsiteSources(agentId: number): Promise<WebsiteSource[]> {
    const response = await apiClient.get<WebsiteSourcesResponse>(
      API_ENDPOINTS.SOURCES.WEBSITE.GET_ALL(agentId)
    );
    // Always return an array, even if backend returns null/undefined
    return response.data?.data || [];
  }

  /**
   * Get a single website source by ID
   */
  static async getWebsiteSource(id: number): Promise<WebsiteSource> {
    const response = await apiClient.get<WebsiteSourceResponse>(
      API_ENDPOINTS.SOURCES.WEBSITE.GET(id)
    );
    return response.data.data;
  }

  /**
   * Update a website source
   */
  static async updateWebsiteSource(
    id: number,
    request: UpdateWebsiteSourceRequest
  ): Promise<WebsiteSource> {
    const response = await apiClient.put<WebsiteSourceResponse>(
      API_ENDPOINTS.SOURCES.WEBSITE.UPDATE(id),
      request
    );
    return response.data.data;
  }

  /**
   * Delete a website source
   */
  static async deleteWebsiteSource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.DELETE(id));
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
    const response = await apiClient.post<{
      accessible: boolean;
      statusCode: number;
      title?: string;
      description?: string;
      error?: string;
    }>(API_ENDPOINTS.SOURCES.WEBSITE.TEST, { url });
    return response.data;
  }
}
