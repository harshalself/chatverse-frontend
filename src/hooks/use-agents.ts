import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from "@tanstack/react-query";
import { AgentsService } from "@/services/agents.service";
import {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
} from "@/types/agent.types";
import { PaginationOptions } from "@/types/api.types";
import { QUERY_KEYS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { useMemo } from "react";

const SUCCESS_MESSAGES = {
  AGENT_CREATED: "Agent created successfully",
  AGENT_UPDATED: "Agent updated successfully",
  AGENT_DELETED: "Agent deleted successfully",
};

// Helper function to prefetch agents (useful for app initialization)
export const prefetchAgents = async (
  queryClient: QueryClient,
  options?: PaginationOptions
) => {
  await queryClient.prefetchQuery({
    queryKey: [...QUERY_KEYS.AGENTS, options],
    queryFn: () => AgentsService.getAgents(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all agents with pagination
export const useAgents = (options?: PaginationOptions) => {
  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(
    () => options,
    [options?.page, options?.limit, options?.sort, options?.filter]
  );

  return useQuery({
    queryKey: [...QUERY_KEYS.AGENTS, memoizedOptions],
    queryFn: () => AgentsService.getAgents(memoizedOptions),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};

// Prefetch a single agent (useful for navigation)
export const prefetchAgent = async (queryClient: QueryClient, id: string) => {
  if (!id) return;

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.AGENT(id),
    queryFn: () => AgentsService.getAgent(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single agent with optimized configuration
export const useAgent = (id: string, enabled = true) => {
  // Memoize id to prevent unnecessary re-renders
  const memoizedId = useMemo(() => id, [id]);

  return useQuery({
    queryKey: QUERY_KEYS.AGENT(memoizedId),
    queryFn: () => AgentsService.getAgent(memoizedId),
    enabled: enabled && !!memoizedId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
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
    onSuccess: (response) => {
      const updatedAgent = response.data;

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
