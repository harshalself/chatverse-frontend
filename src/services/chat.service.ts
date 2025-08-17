import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  ChatRequest,
  ChatResponse,
  AgentChatRequest,
  AgentChatResponse,
  CreateSessionRequest,
  CreateSessionResponse,
  Message,
  UIMessage,
  DEFAULT_CHAT_MODEL,
  ChatSession,
  ChatHistory,
  SessionsResponse,
  HistoryResponse,
} from "@/types/chat.types";

export class ChatService {
  /**
   * Send chat messages to the AI service
   */
  static async sendChatMessage(
    messages: Message[] | UIMessage[],
    model?: string
  ): Promise<ChatResponse> {
    // Convert UIMessages to Messages if needed
    const apiMessages: Message[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const requestData: ChatRequest = {
      messages: apiMessages,
      model: (model as any) || DEFAULT_CHAT_MODEL,
    };

    // The response interceptor returns response.data directly
    const response = await apiClient.post(
      API_ENDPOINTS.PLAYGROUND.CHAT,
      requestData
    );
    return response.data;
  }

  /**
   * Send chat messages to a specific agent with session management
   */
  static async sendAgentChatMessage(
    agentId: number,
    messages: Message[] | UIMessage[],
    sessionId?: string
  ): Promise<AgentChatResponse> {
    // Convert UIMessages to Messages if needed
    const apiMessages: Message[] = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const requestData: AgentChatRequest = {
      messages: apiMessages,
      ...(sessionId && { sessionId }),
    };

    // The response interceptor returns response.data directly
    const response = await apiClient.post(
      API_ENDPOINTS.PLAYGROUND.AGENT_CHAT(agentId),
      requestData
    );

    // Add warning if response message is empty
    if (response.data && !response.data.message) {
      console.warn(
        "⚠️ Backend returned empty message! This might be a backend issue"
      );
    }

    return response.data;
  }

  /**
   * Get all chat sessions for the authenticated user
   */
  static async getChatSessions(agentId?: number): Promise<ChatSession[]> {
    const url = agentId
      ? `${API_ENDPOINTS.PLAYGROUND.SESSIONS}?agent_id=${agentId}`
      : API_ENDPOINTS.PLAYGROUND.SESSIONS;

    const response = await apiClient.get(url);

    // The apiClient already returns response.data, so response is the actual data
    const data: SessionsResponse = response as unknown as SessionsResponse;

    return data?.data || [];
  }

  /**
   * Create a new chat session for an agent
   */
  static async createSession(agentId: number): Promise<CreateSessionResponse> {
    const requestData: CreateSessionRequest = {
      agentId,
    };

    const response = await apiClient.post(
      API_ENDPOINTS.PLAYGROUND.CREATE_SESSION,
      requestData
    );

    // The apiClient interceptor already returns response.data,
    // so 'response' here is actually the response body directly
    return response as unknown as CreateSessionResponse;
  }

  /**
   * Get chat history for a specific session
   */
  static async getSessionHistory(sessionId: number): Promise<ChatHistory> {
    console.log(
      "[DEBUG] ChatService.getSessionHistory: Fetching history for session:",
      sessionId
    );

    const response = await apiClient.get(
      API_ENDPOINTS.PLAYGROUND.SESSION_HISTORY(sessionId.toString())
    );

    console.log(
      "[DEBUG] ChatService.getSessionHistory: Raw response:",
      response
    );
    console.log(
      "[DEBUG] ChatService.getSessionHistory: Response data:",
      response.data
    );

    // Check if the response has nested structure or direct structure
    let result: ChatHistory;

    if (response.data && response.data.data) {
      // Nested structure: {data: {session_id, messages}, message}
      console.log(
        "[DEBUG] ChatService.getSessionHistory: Using nested structure"
      );
      result = response.data.data;
    } else if (response.data && response.data.session_id !== undefined) {
      // Direct structure: {session_id, messages}
      console.log(
        "[DEBUG] ChatService.getSessionHistory: Using direct structure"
      );
      result = response.data;
    } else {
      // Fallback to empty history
      console.log(
        "[DEBUG] ChatService.getSessionHistory: Using fallback structure"
      );
      result = { session_id: sessionId, messages: [] };
    }

    console.log("[DEBUG] ChatService.getSessionHistory: Final result:", result);

    return result;
  }

  /**
   * Delete a chat session
   */
  static async deleteSession(sessionId: number): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.PLAYGROUND.DELETE_SESSION(sessionId.toString())
    );
  }

  /**
   * Get available chat models
   */
  static getAvailableModels(): string[] {
    return [
      "meta-llama/llama-4-scout-17b-16e-instruct",
      "deepseek-r1-distill-llama-70b",
    ];
  }
}
