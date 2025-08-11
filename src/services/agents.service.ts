import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  AgentResponse,
  AgentsResponse,
  TrainAgentRequest,
  TrainAgentResponse,
  TrainingStatusResponse,
  TrainingAnalyticsResponse,
} from "@/types/agent.types";
import { PaginationOptions } from "@/types/api.types";

export class AgentsService {
  /**
   * Get all agents - returns consistent ApiResponse structure
   */
  static async getAgents(options?: PaginationOptions): Promise<AgentsResponse> {
    const params = new URLSearchParams();

    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.AGENTS.LIST}?${queryString}`
      : API_ENDPOINTS.AGENTS.LIST;

    return apiClient.get(url);
  }

  /**
   * Get single agent by ID - returns consistent ApiResponse structure
   */
  static async getAgent(id: string): Promise<AgentResponse> {
    return apiClient.get(API_ENDPOINTS.AGENTS.GET(id));
  }

  /**
   * Create new agent - returns consistent ApiResponse structure
   */
  static async createAgent(data: CreateAgentRequest): Promise<AgentResponse> {
    return apiClient.post(API_ENDPOINTS.AGENTS.CREATE, data);
  }

  /**
   * Update existing agent - returns consistent ApiResponse structure
   */
  static async updateAgent(
    id: string,
    data: UpdateAgentRequest
  ): Promise<AgentResponse> {
    return apiClient.put(API_ENDPOINTS.AGENTS.UPDATE(id), data);
  }

  /**
   * Delete agent - returns consistent ApiResponse structure
   */
  static async deleteAgent(id: string): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.AGENTS.DELETE(id));
  }

  /**
   * Train agent - starts agent training process
   */
  static async trainAgent(
    id: string,
    data?: TrainAgentRequest
  ): Promise<TrainAgentResponse> {
    return apiClient.post(API_ENDPOINTS.AGENTS.TRAIN(id), data || {});
  }

  /**
   * Retrain agent - forces complete retraining
   */
  static async retrainAgent(id: string): Promise<TrainAgentResponse> {
    return apiClient.post(API_ENDPOINTS.AGENTS.RETRAIN(id), {});
  }

  /**
   * Get training status for agent
   */
  static async getTrainingStatus(
    id: string,
    includeHistory = false
  ): Promise<TrainingStatusResponse> {
    const params = includeHistory ? "?includeHistory=true" : "";
    return apiClient.get(
      `${API_ENDPOINTS.AGENTS.TRAINING_STATUS(id)}${params}`
    );
  }

  /**
   * Get training analytics for agent
   */
  static async getTrainingAnalytics(
    id: string,
    timeRange = "30d",
    includeRecommendations = true
  ): Promise<TrainingAnalyticsResponse> {
    const params = new URLSearchParams({
      timeRange,
      includeRecommendations: includeRecommendations.toString(),
    });
    return apiClient.get(
      `${API_ENDPOINTS.AGENTS.TRAINING_ANALYTICS(id)}?${params}`
    );
  }
}
