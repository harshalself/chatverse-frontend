import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { QASource, QASourceRequest } from "@/types/source.types";

/**
 * QA sources service for handling Q&A-based sources
 */
export class QASourcesService {
  /**
   * Create a new QA source
   */
  static async createQASource(
    agentId: number,
    data: QASourceRequest
  ): Promise<QASource> {
    const payload = {
      agent_id: agentId,
      ...data
    };
    
    const response = await apiClient.post(
      API_ENDPOINTS.SOURCES.QA.CREATE,
      payload
    );
    return response.data;
  }

  /**
   * Get all QA sources for an agent
   */
  static async getQASources(agentId: number): Promise<QASource[]> {
    const response = await apiClient.get(
      API_ENDPOINTS.SOURCES.QA.GET_ALL(agentId)
    );
    return response.data;
  }

  /**
   * Get a single QA source by ID
   */
  static async getQASource(id: number): Promise<QASource> {
    const response = await apiClient.get(API_ENDPOINTS.SOURCES.QA.GET(id));
    return response.data;
  }

  /**
   * Update a QA source
   */
  static async updateQASource(
    id: number, 
    data: Partial<QASourceRequest>
  ): Promise<QASource> {
    const response = await apiClient.put(
      API_ENDPOINTS.SOURCES.QA.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Delete a QA source
   */
  static async deleteQASource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.QA.DELETE(id));
  }
}
