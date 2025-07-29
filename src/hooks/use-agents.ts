import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AgentsService } from "@/services/agents.service";
import { 
  Agent, 
  CreateAgentRequest, 
  UpdateAgentRequest 
} from "@/types/agent.types";
import { PaginationOptions } from "@/types/api.types";
import { QUERY_KEYS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

const SUCCESS_MESSAGES = {
  AGENT_CREATED: "Agent created successfully",
  AGENT_UPDATED: "Agent updated successfully", 
  AGENT_DELETED: "Agent deleted successfully",
};

// Get all agents with pagination
export const useAgents = (options?: PaginationOptions) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.AGENTS, options],
    queryFn: () => AgentsService.getAgents(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
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
