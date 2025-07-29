import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "@/types/agent.types";
import { PaginationOptions } from "@/types/api.types";

export class AgentsService {
  /**
   * Get all agents with pagination and filtering
   */
  static async getAgents(
    options?: PaginationOptions
  ): Promise<{ data: Agent[]; message: string }> {
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
   * Get single agent by ID
   */
  static async getAgent(id: string): Promise<{ data: Agent; message: string }> {
    return apiClient.get(API_ENDPOINTS.AGENTS.GET(id));
  }

  /**
   * Create new agent
   */
  static async createAgent(data: CreateAgentRequest): Promise<Agent> {
    const response = await apiClient.post(API_ENDPOINTS.AGENTS.CREATE, data);
    return response; // Backend returns agent directly, not wrapped in data
  }

  /**
   * Update existing agent
   */
  static async updateAgent(
    id: string,
    data: UpdateAgentRequest
  ): Promise<{ data: Agent; message: string }> {
    return apiClient.put(API_ENDPOINTS.AGENTS.UPDATE(id), data);
  }

  /**
   * Delete agent
   */
  static async deleteAgent(id: string): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.AGENTS.DELETE(id));
  }
}
