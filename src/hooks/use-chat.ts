import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "@/services/chat.service";
import { QUERY_KEYS } from "@/lib/constants";
import {
  Message,
  UIMessage,
  ChatResponse,
  AgentChatResponse,
  CreateSessionResponse,
  ChatModel,
  ChatSession,
  ChatHistory,
} from "@/types/chat.types";
import { ErrorHandler } from "@/lib/error-handler";
import { toast } from "sonner";

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
 * Hook for sending agent chat messages
 */
export const useSendAgentChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      messages,
      sessionId,
    }: {
      agentId: number;
      messages: Message[] | UIMessage[];
      sessionId?: string;
    }) => ChatService.sendAgentChatMessage(agentId, messages, sessionId),
    onSuccess: (data) => {
      // Invalidate sessions list to refresh it with the new/updated session
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CHAT_SESSIONS,
      });

      // Handle both response shapes: nested (data.data) and flat (data)
      const response = data?.data ?? data;
      let sessionId: number | undefined;

      // Type guard to safely get sessionId from either shape
      if (response && "sessionId" in response) {
        sessionId = response.sessionId;
      }

      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CHAT_SESSION_HISTORY(sessionId.toString()),
        });
      } else {
        // Log a warning only if neither shape has sessionId
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.warn("Agent chat response missing sessionId:", data);
        }
      }
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to send agent chat message");
    },
  });
};

/**
 * Hook for creating a new chat session
 */
export const useCreateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: number) => ChatService.createSession(agentId),
    onSuccess: (response) => {
      // Debug: Log the actual response structure
      console.log("Create session response:", response);

      // Invalidate sessions list to refresh it with the new session
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CHAT_SESSIONS,
      });

      // Now that the apiClient returns response.data directly,
      // the response should have the correct structure
      const sessionId = response.data.id;
      toast.success(`New session #${sessionId} created successfully`);
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to create session");
    },
  });
};

/**
 * Hook for getting chat sessions
 */
export const useChatSessions = (agentId?: number, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CHAT_SESSIONS, agentId ?? "all"],
    queryFn: async () => {
      // If agentId is explicitly null or undefined, get all sessions
      const sessions = await ChatService.getChatSessions(agentId ?? undefined);
      return sessions ?? [];
    },
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for getting chat session history
 */
export const useSessionHistory = (sessionId: number, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.CHAT_SESSION_HISTORY(sessionId.toString()),
    queryFn: async () => {
      try {
        const history = await ChatService.getSessionHistory(sessionId);
        return history ?? { session_id: sessionId, messages: [] };
      } catch (error) {
        // Return empty history if session not found or error occurs
        return { session_id: sessionId, messages: [] };
      }
    },
    enabled: enabled && !!sessionId,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook for deleting a chat session
 */
export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: number) => ChatService.deleteSession(sessionId),
    onSuccess: (_, deletedSessionId) => {
      // Remove the deleted session from all related queries
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.CHAT_SESSION_HISTORY(deletedSessionId.toString()),
      });

      // Invalidate sessions list to refresh it
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CHAT_SESSIONS,
      });

      toast.success("Session deleted successfully");
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to delete session");
    },
  });
};

/**
 * Get available chat models
 */
export const useAvailableChatModels = () => {
  return ChatService.getAvailableModels();
};
