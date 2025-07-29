import { apiClient, TokenManager } from "@/lib/api/client";
import { API_ENDPOINTS, APP_CONFIG } from "@/lib/constants";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  Conversation,
  Message,
  MessageRole,
} from "@/types/agent.types";
import { PaginatedResponse, PaginationOptions } from "@/types/api.types";
import axios from "axios";

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

    return (await apiClient.get(url)) as PaginatedResponse<Agent>;
  }

  /**
   * Get single agent by ID
   */
  static async getAgent(id: string): Promise<Agent> {
    return (await apiClient.get(API_ENDPOINTS.AGENTS.GET(id))) as Agent;
  }

  /**
   * Create new agent
   */
  static async createAgent(data: CreateAgentRequest): Promise<Agent> {
    return (await apiClient.post(API_ENDPOINTS.AGENTS.CREATE, data)) as Agent;
  }

  /**
   * Update existing agent
   */
  static async updateAgent(
    id: string,
    data: UpdateAgentRequest
  ): Promise<Agent> {
    return (await apiClient.put(
      API_ENDPOINTS.AGENTS.UPDATE(id),
      data
    )) as Agent;
  }

  /**
   * Delete agent
   */
  static async deleteAgent(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.AGENTS.DELETE(id));
  }

  /**
   * Duplicate agent
   */
  static async duplicateAgent(id: string, name?: string): Promise<Agent> {
    return (await apiClient.post(`/agents/${id}/duplicate`, { name })) as Agent;
  }

  /**
   * Train agent with new data
   */
  static async trainAgent(
    id: string,
    trainingData: any
  ): Promise<{ taskId: string }> {
    return (await apiClient.post(`/agents/${id}/train`, trainingData)) as {
      taskId: string;
    };
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
    return (await apiClient.post(`/agents/${id}/deploy`)) as {
      deploymentId: string;
    };
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

    return (await apiClient.get(url)) as PaginatedResponse<Conversation>;
  }

  /**
   * Create new conversation with agent
   */
  static async createConversation(
    agentId: string,
    title?: string
  ): Promise<Conversation> {
    return (await apiClient.post(`/agents/${agentId}/conversations`, {
      title,
    })) as Conversation;
  }

  /**
   * Send message to agent
   */
  static async sendMessage(
    agentId: string,
    conversationId: string,
    content: string
  ): Promise<Message> {
    return (await apiClient.post(
      `/agents/${agentId}/conversations/${conversationId}/messages`,
      {
        content,
        role: "user" as MessageRole,
      }
    )) as Message;
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

    return (await apiClient.get(url)) as PaginatedResponse<Message>;
  }

  /**
   * Archive conversation
   */
  static async archiveConversation(
    agentId: string,
    conversationId: string
  ): Promise<void> {
    await apiClient.patch(
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
    await apiClient.delete(
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
    const response = await axios.get(
      `${APP_CONFIG.apiBaseUrl}/agents/${id}/export`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${TokenManager.getToken()} public`,
        },
      }
    );
    return response.data;
  }

  /**
   * Import agent configuration
   */
  static async importAgent(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<Agent> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${APP_CONFIG.apiBaseUrl}/agents/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${TokenManager.getToken()} public`,
        },
        onUploadProgress: onProgress
          ? (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              onProgress(progress);
            }
          : undefined,
      }
    );
    return response.data;
  }
}
