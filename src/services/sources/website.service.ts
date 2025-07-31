import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { WebsiteSource, WebsiteSourceRequest } from "@/types/source.types";

/**
 * Website sources service for handling website-based sources
 */
export class WebsiteSourcesService {
  /**
   * Create a new website source
   */
  static async createWebsiteSource(
    agentId: number,
    data: WebsiteSourceRequest
  ): Promise<WebsiteSource> {
    const payload = {
      agent_id: agentId,
      ...data
    };
    
    const response = await apiClient.post(
      API_ENDPOINTS.SOURCES.WEBSITE.CREATE,
      payload
    );
    return response.data;
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
    return apiClient.post(API_ENDPOINTS.SOURCES.WEBSITE.TEST, { url });
  }

  /**
   * Get all website sources for an agent
   */
  static async getWebsiteSources(agentId: number): Promise<WebsiteSource[]> {
    const response = await apiClient.get(
      API_ENDPOINTS.SOURCES.WEBSITE.GET_ALL(agentId)
    );
    return response.data;
  }

  /**
   * Get a single website source by ID
   */
  static async getWebsiteSource(id: number): Promise<WebsiteSource> {
    const response = await apiClient.get(API_ENDPOINTS.SOURCES.WEBSITE.GET(id));
    return response.data;
  }

  /**
   * Update a website source
   */
  static async updateWebsiteSource(
    id: number, 
    data: Partial<WebsiteSourceRequest>
  ): Promise<WebsiteSource> {
    const response = await apiClient.put(
      API_ENDPOINTS.SOURCES.WEBSITE.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Delete a website source
   */
  static async deleteWebsiteSource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.WEBSITE.DELETE(id));
  }
}
