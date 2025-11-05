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
  TrainAgentRequest,
  TrainingStatus,
  TrainingAnalytics,
} from "@/types/agent.types";
import { PaginationOptions } from "@/types/api.types";
import { QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { ErrorHandler } from "@/lib/error-handler";
import { toast } from "@/hooks/use-toast";
import { useMemo, useRef, useEffect } from "react";

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
export const useAgents = (options?: Partial<PaginationOptions> & { enabled?: boolean }) => {
  // Extract enabled from options, default to true
  const enabled = options?.enabled !== undefined ? options.enabled : true;
  
  // Memoize pagination options without enabled flag
  const memoizedOptions = useMemo(() => {
    if (!options) return undefined;
    const { enabled: _, ...paginationOptions } = options;
    return Object.keys(paginationOptions).length > 0 ? paginationOptions : undefined;
  }, [options?.page, options?.limit, options?.sort, options?.filter]);

  return useQuery({
    queryKey: [...QUERY_KEYS.AGENTS, memoizedOptions],
    queryFn: async () => {
      const response: any = await AgentsService.getAgents(memoizedOptions);
      // Debug log to see what the backend returns
      console.log("Agents API response:", response);
      if (response.data) {
        if (Array.isArray(response.data)) {
          return response.data;
        } else if (Array.isArray(response.data.agents)) {
          return response.data.agents;
        } else if (Array.isArray(response.data.users)) {
          return response.data.users;
        }
      }
      return [];
    },
    enabled, // Use the enabled option
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
    queryFn: async () => {
      const response = await AgentsService.getAgent(memoizedId);
      return response.data; // Extract data from ApiResponse
    },
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
    onSuccess: (response) => {
      const newAgent = response.data;

      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });

      // Add to cache
      queryClient.setQueryData(QUERY_KEYS.AGENT(newAgent.id), newAgent);

      toast({
        title: "Success",
        description: response.message || SUCCESS_MESSAGES.AGENT_CREATED,
      });
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to create agent");
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

      toast({
        title: "Success",
        description: response.message || SUCCESS_MESSAGES.AGENT_UPDATED,
      });
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to update agent");
    },
  });
};

// Delete agent mutation
export const useDeleteAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AgentsService.deleteAgent(id),
    onSuccess: (response, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.AGENT(deletedId) });

      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });

      toast({
        title: "Success",
        description: response.message || SUCCESS_MESSAGES.AGENT_DELETED,
      });
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to delete agent");
    },
  });
};

// Train agent mutation
export const useTrainAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: TrainAgentRequest }) =>
      AgentsService.trainAgent(id, data),
    onSuccess: (response, { id }) => {
      // Immediately invalidate training status to start polling
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.AGENT_TRAINING_STATUS(id),
      });

      // Invalidate agent data to refresh trained_on timestamp
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENT(id) });

      // Force an immediate refetch of training status to start polling
      setTimeout(() => {
        queryClient.refetchQueries({
          queryKey: QUERY_KEYS.AGENT_TRAINING_STATUS(id),
        });
      }, 500); // Small delay to let the backend update

      // Success toast is now handled in the component
    },
    onError: (error: any) => {
      // Check for specific backend error about sources not ready for embedding
      if (error?.response?.status === 400 && 
          error?.response?.data?.message?.includes("No sources ready for embedding found")) {
        toast({
          title: "Sources Already Processed",
          description: "All sources have already been embedded. Add new sources to train the agent further.",
          variant: "destructive",
        });
        return;
      }
      
      // Handle other errors with the generic error handler
      ErrorHandler.handleApiError(error, "Failed to start agent training");
    },
  });
};

// Retrain agent mutation
export const useRetrainAgent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AgentsService.retrainAgent(id),
    onSuccess: (response, id) => {
      // Invalidate training status to refresh it
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.AGENT_TRAINING_STATUS(id),
      });

      // Invalidate agent data to refresh trained_on timestamp
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENT(id) });

      toast({
        title: "Success",
        description:
          response.message || SUCCESS_MESSAGES.AGENT_RETRAINING_STARTED,
      });
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to start agent retraining");
    },
  });
};

// Get training status with polling and completion notifications
export const useTrainingStatus = (
  id: string,
  enabled = true,
  pollInterval = 5000 // 5 seconds polling interval
) => {
  const memoizedId = useMemo(() => id, [id]);
  const previousStatusRef = useRef<string | null>(null);
  const queryClient = useQueryClient();
  const hasShownCompletionToast = useRef<boolean>(false);

  const query = useQuery({
    queryKey: QUERY_KEYS.AGENT_TRAINING_STATUS(memoizedId),
    queryFn: async () => {
      const response = await AgentsService.getTrainingStatus(memoizedId);
      console.log(
        `Training status API response for agent ${memoizedId}:`,
        response.data
      );
      return response.data as TrainingStatus;
    },
    enabled: enabled && !!memoizedId,
    refetchInterval: (query) => {
      const data = query.state.data;
      console.log(`Refetch interval check - Status: ${data?.status}`);

      // Stop polling if training is completed, failed, or cancelled
      if (
        data?.status &&
        ["completed", "failed", "cancelled"].includes(data.status)
      ) {
        console.log(
          `Stopping polling - training finished with status: ${data.status}`
        );
        return false;
      }

      // Always poll every 5 seconds if we have an agent ID and are enabled
      // This ensures polling starts immediately after training begins
      console.log(
        `Polling every ${pollInterval}ms - status: ${data?.status || 'unknown'}`
      );
      return pollInterval;
    },
    staleTime: 0, // Always consider stale for real-time updates
    retry: 1,
    refetchOnWindowFocus: true, // Enable refetch on focus to catch status changes
  });

  // Effect to detect status changes and show completion notifications
  useEffect(() => {
    const currentStatus = query.data?.status;

    if (!currentStatus) return;

    // Initialize previousStatus if it's the first time
    if (previousStatusRef.current === null) {
      previousStatusRef.current = currentStatus;
      // Reset completion toast flag when starting fresh
      if (currentStatus === "not_started" || currentStatus === "pending") {
        hasShownCompletionToast.current = false;
      }
      return;
    }

    const previousStatus = previousStatusRef.current;

    // Only show notification if status actually changed
    if (previousStatus !== currentStatus) {
      console.log(
        `Training status changed: ${previousStatus} → ${currentStatus}`
      );

      // Training completed successfully
      if (
        (previousStatus === "processing" || previousStatus === "pending") &&
        currentStatus === "completed" &&
        !hasShownCompletionToast.current
      ) {
        hasShownCompletionToast.current = true;
        toast({
          title: "Training Complete! 🎉",
          description: SUCCESS_MESSAGES.AGENT_TRAINING_COMPLETED,
          variant: "default",
        });

        // Invalidate related queries to refresh UI
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.AGENT(memoizedId),
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AGENTS });
        
        // Invalidate sources queries to refresh SourcesSummary
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEYS.SOURCES, "by-agent", Number(memoizedId)]
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });
      }

      // Training failed
      else if (
        (previousStatus === "processing" || previousStatus === "pending") &&
        currentStatus === "failed" &&
        !hasShownCompletionToast.current
      ) {
        hasShownCompletionToast.current = true;
        toast({
          title: "Training Failed ❌",
          description:
            query.data?.error?.message ||
            SUCCESS_MESSAGES.AGENT_TRAINING_FAILED,
          variant: "destructive",
        });
      }

      // Training cancelled
      else if (
        (previousStatus === "processing" || previousStatus === "pending") &&
        currentStatus === "cancelled" &&
        !hasShownCompletionToast.current
      ) {
        hasShownCompletionToast.current = true;
        toast({
          title: "Training Cancelled ⏹️",
          description: SUCCESS_MESSAGES.AGENT_TRAINING_CANCELLED,
          variant: "default",
        });
      }

      // Update the previous status reference
      previousStatusRef.current = currentStatus;
    }
  }, [query.data?.status, query.data?.error?.message, memoizedId, queryClient]);

  // Reset completion toast flag when training starts again
  useEffect(() => {
    const currentStatus = query.data?.status;
    if (currentStatus === "pending" || currentStatus === "processing") {
      hasShownCompletionToast.current = false;
    }
  }, [query.data?.status]);

  return query;
};

// Get training analytics
export const useTrainingAnalytics = (
  id: string,
  enabled = true,
  timeRange: string = "30d",
  includeRecommendations = true
) => {
  const memoizedId = useMemo(() => id, [id]);

  return useQuery({
    queryKey: [
      ...QUERY_KEYS.AGENT_TRAINING_ANALYTICS(memoizedId),
      timeRange,
      includeRecommendations,
    ],
    queryFn: async () => {
      const response = await AgentsService.getTrainingAnalytics(
        memoizedId,
        timeRange,
        includeRecommendations
      );
      return response.data as TrainingAnalytics;
    },
    enabled: enabled && !!memoizedId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
