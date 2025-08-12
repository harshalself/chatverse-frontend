import { useMutation } from "@tanstack/react-query";
import { ChatService } from "@/services/chat.service";
import {
  Message,
  UIMessage,
  ChatResponse,
  ChatModel,
} from "@/types/chat.types";
import { ErrorHandler } from "@/lib/error-handler";

/**
 * Hook for sending chat messages
 */
export const useSendChatMessage = () => {
  return useMutation({
    mutationFn: ({
      messages,
      model,
    }: {
      messages: Message[] | UIMessage[];
      model?: ChatModel;
    }) => ChatService.sendChatMessage(messages, model),
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to send chat message");
    },
  });
};

/**
 * Hook for sending a simple chat message with conversation history
 */
export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({
      content,
      conversationHistory,
      model,
    }: {
      content: string;
      conversationHistory?: Message[];
      model?: ChatModel;
    }) => ChatService.sendMessage(content, conversationHistory, model),
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to send message");
    },
  });
};

/**
 * Get available chat models
 */
export const useAvailableChatModels = () => {
  return ChatService.getAvailableModels();
};
