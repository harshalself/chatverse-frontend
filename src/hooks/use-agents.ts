import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { AgentsService } from "@/services/agents.service";
import { QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  Conversation,
  Message,
} from "@/types/agent.types";
import { PaginatedResponse, PaginationOptions } from "@/types/api.types";

// Get all agents with pagination
export const useAgents = (options?: PaginationOptions) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.AGENTS, options],
    queryFn: () => AgentsService.getAgents(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Get agents with infinite loading
export const useInfiniteAgents = (
  options?: Omit<PaginationOptions, "page">
) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.AGENTS, "infinite", options],
    queryFn: ({ pageParam = 1 }) =>
      AgentsService.getAgents({ ...options, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<Agent>) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Get single agent
export const useAgent = (id: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.AGENT(id),
    queryFn: () => AgentsService.getAgent(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create agent mutation
export const useCreateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAgentRequest) => AgentsService.createAgent(data),
    onSuccess: (newAgent: Agent) => {
      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });

      // Add to cache
      queryClient.setQueryData(QUERY_KEYS.AGENT(newAgent.id), newAgent);

      toast({ title: "Success", description: SUCCESS_MESSAGES.AGENT_CREATED });
    },
    onError: (error) => {
      console.error("Create agent error:", error);
    },
  });
};

// Update agent mutation
export const useUpdateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAgentRequest }) =>
      AgentsService.updateAgent(id, data),
    onSuccess: (updatedAgent: Agent) => {
      // Update agent in cache
      queryClient.setQueryData(QUERY_KEYS.AGENT(updatedAgent.id), updatedAgent);

      // Invalidate agents list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });

      toast({ title: "Success", description: SUCCESS_MESSAGES.AGENT_UPDATED });
    },
    onError: (error) => {
      console.error("Update agent error:", error);
    },
  });
};

// Delete agent mutation
export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AgentsService.deleteAgent(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.AGENT(deletedId) });

      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });

      toast({ title: "Success", description: SUCCESS_MESSAGES.AGENT_DELETED });
    },
    onError: (error) => {
      console.error("Delete agent error:", error);
    },
  });
};

// Duplicate agent mutation
export const useDuplicateAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name?: string }) =>
      AgentsService.duplicateAgent(id, name),
    onSuccess: (duplicatedAgent: Agent) => {
      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });

      // Add to cache
      queryClient.setQueryData(
        QUERY_KEYS.AGENT(duplicatedAgent.id),
        duplicatedAgent
      );

      toast({ title: "Success", description: "Agent duplicated successfully" });
    },
    onError: (error) => {
      console.error("Duplicate agent error:", error);
    },
  });
};

// Train agent mutation
export const useTrainAgent = () => {
  return useMutation({
    mutationFn: ({ id, trainingData }: { id: string; trainingData: any }) =>
      AgentsService.trainAgent(id, trainingData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Agent training started successfully",
      });
    },
    onError: (error) => {
      console.error("Train agent error:", error);
    },
  });
};

// Get training status
export const useTrainingStatus = (
  agentId: string,
  taskId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["training-status", agentId, taskId],
    queryFn: () => AgentsService.getTrainingStatus(agentId, taskId),
    enabled: enabled && !!agentId && !!taskId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if training is in progress
      const data = query.state.data;
      return data?.status === "running" || data?.status === "pending"
        ? 2000
        : false;
    },
  });
};

// Deploy agent mutation
export const useDeployAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AgentsService.deployAgent(id),
    onSuccess: (_, agentId) => {
      // Invalidate agent data to refresh status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENT(agentId) });

      toast({ title: "Success", description: "Agent deployed successfully" });
    },
    onError: (error) => {
      console.error("Deploy agent error:", error);
    },
  });
};

// Get agent conversations
export const useAgentConversations = (
  agentId: string,
  options?: PaginationOptions
) => {
  return useQuery({
    queryKey: ["agent-conversations", agentId, options],
    queryFn: () => AgentsService.getAgentConversations(agentId, options),
    enabled: !!agentId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Create conversation mutation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, title }: { agentId: string; title?: string }) =>
      AgentsService.createConversation(agentId, title),
    onSuccess: (_, { agentId }) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: ["agent-conversations", agentId],
      });

      toast({
        title: "Success",
        description: "Conversation created successfully",
      });
    },
    onError: (error) => {
      console.error("Create conversation error:", error);
    },
  });
};

// Send message mutation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      conversationId,
      content,
    }: {
      agentId: string;
      conversationId: string;
      content: string;
    }) => AgentsService.sendMessage(agentId, conversationId, content),
    onSuccess: (_, { agentId, conversationId }) => {
      // Invalidate conversation messages
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages", agentId, conversationId],
      });
    },
    onError: (error) => {
      console.error("Send message error:", error);
    },
  });
};

// Get conversation messages
export const useConversationMessages = (
  agentId: string,
  conversationId: string,
  options?: PaginationOptions
) => {
  return useQuery({
    queryKey: ["conversation-messages", agentId, conversationId, options],
    queryFn: () =>
      AgentsService.getConversationMessages(agentId, conversationId, options),
    enabled: !!agentId && !!conversationId,
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Archive conversation mutation
export const useArchiveConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      conversationId,
    }: {
      agentId: string;
      conversationId: string;
    }) => AgentsService.archiveConversation(agentId, conversationId),
    onSuccess: (_, { agentId }) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: ["agent-conversations", agentId],
      });

      toast({
        title: "Success",
        description: "Conversation archived successfully",
      });
    },
    onError: (error) => {
      console.error("Archive conversation error:", error);
    },
  });
};

// Delete conversation mutation
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      conversationId,
    }: {
      agentId: string;
      conversationId: string;
    }) => AgentsService.deleteConversation(agentId, conversationId),
    onSuccess: (_, { agentId, conversationId }) => {
      // Remove conversation messages from cache
      queryClient.removeQueries({
        queryKey: ["conversation-messages", agentId, conversationId],
      });

      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: ["agent-conversations", agentId],
      });

      toast({
        title: "Success",
        description: "Conversation deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Delete conversation error:", error);
    },
  });
};

// Get agent analytics
export const useAgentAnalytics = (
  agentId: string,
  timeRange: "24h" | "7d" | "30d" | "90d" = "7d"
) => {
  return useQuery({
    queryKey: ["agent-analytics", agentId, timeRange],
    queryFn: () => AgentsService.getAgentAnalytics(agentId, timeRange),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Import agent mutation
export const useImportAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => AgentsService.importAgent(file, onProgress),
    onSuccess: (importedAgent: Agent) => {
      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });

      // Add to cache
      queryClient.setQueryData(
        QUERY_KEYS.AGENT(importedAgent.id),
        importedAgent
      );

      toast({ title: "Success", description: "Agent imported successfully" });
    },
    onError: (error) => {
      console.error("Import agent error:", error);
    },
  });
};

// Export agent mutation
export const useExportAgent = () => {
  return useMutation({
    mutationFn: (id: string) => AgentsService.exportAgent(id),
    onSuccess: (blob: Blob, agentId: string) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `agent-${agentId}-config.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Agent configuration exported successfully",
      });
    },
    onError: (error) => {
      console.error("Export agent error:", error);
    },
  });
};
