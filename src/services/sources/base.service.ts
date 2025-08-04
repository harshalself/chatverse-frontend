import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  BaseSource,
  BaseSourceResponse,
  BaseSourcesResponse,
} from "@/types/source.types";

/**
 * Base sources service aligned with backend API
 */
export class BaseSourcesService {
  /**
   * Get all sources for a specific agent
   */
  static async getSourcesByAgent(
    agentId: number
  ): Promise<BaseSourcesResponse> {
    return apiClient.get(API_ENDPOINTS.SOURCES.LIST_BY_AGENT(agentId));
  }

  /**
   * Get single source by ID
   */
  static async getSource(id: number): Promise<BaseSourceResponse> {
    return apiClient.get(API_ENDPOINTS.SOURCES.GET(id));
  }

  /**
   * Delete source
   */
  static async deleteSource(id: number): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.SOURCES.DELETE(id));
  }
}
