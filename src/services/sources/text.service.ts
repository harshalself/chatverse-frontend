import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { TextSource } from "@/types/source.types";

/**
 * Text sources service for handling text-based sources
 */
export class TextSourcesService {
  /**
   * Create a new text source
   */
  static async createTextSource(
    agentId: number,
    name: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<TextSource> {
    const payload = {
      agent_id: agentId,
      name,
      content,
      metadata
    };
    
    const response = await apiClient.post(
      API_ENDPOINTS.SOURCES.TEXT.CREATE,
      payload
    );
    return response.data;
  }

  /**
   * Get all text sources for an agent
   */
  static async getTextSources(agentId: number): Promise<TextSource[]> {
    const response = await apiClient.get(
      API_ENDPOINTS.SOURCES.TEXT.GET_ALL(agentId)
    );
    return response.data;
  }

  /**
   * Get a single text source by ID
   */
  static async getTextSource(id: number): Promise<TextSource> {
    const response = await apiClient.get(API_ENDPOINTS.SOURCES.TEXT.GET(id));
    return response.data;
  }

  /**
   * Update a text source
   */
  static async updateTextSource(
    id: number, 
    data: { name?: string; content?: string; metadata?: Record<string, any> }
  ): Promise<TextSource> {
    const response = await apiClient.put(
      API_ENDPOINTS.SOURCES.TEXT.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Delete a text source
   */
  static async deleteTextSource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.TEXT.DELETE(id));
  }
}
