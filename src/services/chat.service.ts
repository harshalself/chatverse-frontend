import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  ChatRequest,
  ChatResponse,
  Message,
  UIMessage,
  DEFAULT_CHAT_MODEL,
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
    // Fix: Extract the main chatbot response from response.data
    return response.data;
  }

  /**
   * Send chat message with just content (convenience method)
   */
  static async sendMessage(
    content: string,
    conversationHistory: Message[] = [],
    model?: string
  ): Promise<ChatResponse> {
    const messages: Message[] = [
      ...conversationHistory,
      { role: "user", content },
    ];

    return this.sendChatMessage(messages, model);
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
