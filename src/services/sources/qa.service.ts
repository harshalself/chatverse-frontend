import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  QASource,
  CreateQASourceRequest,
  UpdateQASourceRequest,
  QASourceResponse,
  QASourcesResponse,
} from "@/types/source.types";

/**
 * QA sources service for handling Q&A-based sources
 */
export class QASourcesService {
  /**
   * Create QA sources from question-answer pairs
   */
  static async createQASource(
    request: CreateQASourceRequest
  ): Promise<QASource[]> {
    const response = await apiClient.post<QASourcesResponse>(
      API_ENDPOINTS.SOURCES.QA.CREATE,
      request
    );
    return response.data.data;
  }

  /**
   * Get all QA sources for an agent
   */
  static async getQASources(agentId: number): Promise<QASource[]> {
    const response = await apiClient.get<QASourcesResponse>(
      API_ENDPOINTS.SOURCES.QA.GET_ALL(agentId)
    );
    return response.data.data;
  }

  /**
   * Get a single QA source by ID
   */
  static async getQASource(id: number): Promise<QASource> {
    const response = await apiClient.get<QASourceResponse>(
      API_ENDPOINTS.SOURCES.QA.GET(id)
    );
    return response.data.data;
  }

  /**
   * Update a QA source
   */
  static async updateQASource(
    id: number,
    request: UpdateQASourceRequest
  ): Promise<QASource> {
    const response = await apiClient.put<QASourceResponse>(
      API_ENDPOINTS.SOURCES.QA.UPDATE(id),
      request
    );
    return response.data.data;
  }

  /**
   * Delete a QA source
   */
  static async deleteQASource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.QA.DELETE(id));
  }
}
