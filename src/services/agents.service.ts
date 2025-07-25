import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  Conversation,
  Message,
  MessageRole,
} from "@/types/agent.types";
import { PaginatedResponse, PaginationOptions } from "@/types/api.types";

export class AgentsService {
  /**
   * Get all agents with pagination and filtering
   */
  static async getAgents(
    options?: PaginationOptions
  ): Promise<PaginatedResponse<Agent>> {
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
      ? `${API_ENDPOINTS.AGENTS.LIST}?${queryString}`
      : API_ENDPOINTS.AGENTS.LIST;

    return apiClient.get<PaginatedResponse<Agent>>(url);
  }

  /**
   * Get single agent by ID
   */
  static async getAgent(id: string): Promise<Agent> {
    return apiClient.get<Agent>(API_ENDPOINTS.AGENTS.GET(id));
  }

  /**
   * Create new agent
   */
  static async createAgent(data: CreateAgentRequest): Promise<Agent> {
    return apiClient.post<Agent>(API_ENDPOINTS.AGENTS.CREATE, data);
  }

  /**
   * Update existing agent
   */
  static async updateAgent(
    id: string,
    data: UpdateAgentRequest
  ): Promise<Agent> {
    return apiClient.put<Agent>(API_ENDPOINTS.AGENTS.UPDATE(id), data);
  }

  /**
   * Delete agent
   */
  static async deleteAgent(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.AGENTS.DELETE(id));
  }

  /**
   * Duplicate agent
   */
  static async duplicateAgent(id: string, name?: string): Promise<Agent> {
    return apiClient.post<Agent>(`/agents/${id}/duplicate`, { name });
  }

  /**
   * Train agent with new data
   */
  static async trainAgent(
    id: string,
    trainingData: any
  ): Promise<{ taskId: string }> {
    return apiClient.post<{ taskId: string }>(
      `/agents/${id}/train`,
      trainingData
    );
  }

  /**
   * Get agent training status
   */
  static async getTrainingStatus(
    id: string,
    taskId: string
  ): Promise<{
    status: "pending" | "running" | "completed" | "failed";
    progress: number;
    message?: string;
  }> {
    return apiClient.get(`/agents/${id}/train/${taskId}/status`);
  }

  /**
   * Deploy agent to production
   */
  static async deployAgent(id: string): Promise<{ deploymentId: string }> {
    return apiClient.post<{ deploymentId: string }>(`/agents/${id}/deploy`);
  }

  /**
   * Get agent conversations
   */
  static async getAgentConversations(
    agentId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResponse<Conversation>> {
    const params = new URLSearchParams();

    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/agents/${agentId}/conversations?${queryString}`
      : `/agents/${agentId}/conversations`;

    return apiClient.get<PaginatedResponse<Conversation>>(url);
  }

  /**
   * Create new conversation with agent
   */
  static async createConversation(
    agentId: string,
    title?: string
  ): Promise<Conversation> {
    return apiClient.post<Conversation>(`/agents/${agentId}/conversations`, {
      title,
    });
  }

  /**
   * Send message to agent
   */
  static async sendMessage(
    agentId: string,
    conversationId: string,
    content: string
  ): Promise<Message> {
    return apiClient.post<Message>(
      `/agents/${agentId}/conversations/${conversationId}/messages`,
      {
        content,
        role: "user" as MessageRole,
      }
    );
  }

  /**
   * Get conversation messages
   */
  static async getConversationMessages(
    agentId: string,
    conversationId: string,
    options?: PaginationOptions
  ): Promise<PaginatedResponse<Message>> {
    const params = new URLSearchParams();

    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());

    const queryString = params.toString();
    const url = queryString
      ? `/agents/${agentId}/conversations/${conversationId}/messages?${queryString}`
      : `/agents/${agentId}/conversations/${conversationId}/messages`;

    return apiClient.get<PaginatedResponse<Message>>(url);
  }

  /**
   * Archive conversation
   */
  static async archiveConversation(
    agentId: string,
    conversationId: string
  ): Promise<void> {
    return apiClient.patch<void>(
      `/agents/${agentId}/conversations/${conversationId}`,
      {
        status: "archived",
      }
    );
  }

  /**
   * Delete conversation
   */
  static async deleteConversation(
    agentId: string,
    conversationId: string
  ): Promise<void> {
    return apiClient.delete<void>(
      `/agents/${agentId}/conversations/${conversationId}`
    );
  }

  /**
   * Get agent analytics
   */
  static async getAgentAnalytics(
    agentId: string,
    timeRange: "24h" | "7d" | "30d" | "90d" = "7d"
  ): Promise<{
    totalConversations: number;
    totalMessages: number;
    averageResponseTime: number;
    successRate: number;
    userSatisfaction: number;
    topics: Array<{ topic: string; count: number }>;
    timeline: Array<{ date: string; conversations: number; messages: number }>;
  }> {
    return apiClient.get(`/agents/${agentId}/analytics?timeRange=${timeRange}`);
  }

  /**
   * Export agent configuration
   */
  static async exportAgent(id: string): Promise<Blob> {
    const response = await apiClient
      .getAxiosInstance()
      .get(`/agents/${id}/export`, {
        responseType: "blob",
      });
    return response.data;
  }

  /**
   * Import agent configuration
   */
  static async importAgent(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<Agent> {
    return apiClient.uploadFile<Agent>("/agents/import", file, onProgress);
  }
}
