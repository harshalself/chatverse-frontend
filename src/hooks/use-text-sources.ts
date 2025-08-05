import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TextSourcesService } from "@/services/sources";
import {
  TextSource,
  CreateTextSourceRequest,
  UpdateTextSourceRequest,
} from "@/types/source.types";
import { SUCCESS_MESSAGES } from "@/lib/constants";
import { ErrorHandler } from "@/lib/error-handler";
import { toast } from "@/hooks/use-toast";

// Text Source API Hooks

// Get text sources for an agent
export const useTextSources = (agentId: number, enabled = true) => {
  return useQuery({
    queryKey: ["text-sources", agentId],
    queryFn: async () => {
      if (!agentId) {
        return [];
      }
      const textSources = await TextSourcesService.getTextSources(agentId);
      return textSources || [];
    },
    enabled: enabled && !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get a single text source
export const useTextSource = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["text-source", id],
    queryFn: () => TextSourcesService.getTextSource(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create a text source
export const useCreateTextSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateTextSourceRequest) =>
      TextSourcesService.createTextSource(request),
    onSuccess: (textSource: TextSource, variables) => {
      // Invalidate text sources list for the agent
      queryClient.invalidateQueries({
        queryKey: ["text-sources", variables.agent_id],
      });

      // Add to cache
      queryClient.setQueryData(["text-source", textSource.id], textSource);

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.SOURCE_CREATED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to create text source");
    },
  });
};

// Update a text source
export const useUpdateTextSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTextSourceRequest }) =>
      TextSourcesService.updateTextSource(id, data),
    onSuccess: (textSource: TextSource) => {
      // Update cache
      queryClient.setQueryData(["text-source", textSource.id], textSource);

      // Invalidate text sources list
      queryClient.invalidateQueries({
        queryKey: ["text-sources"],
      });

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.SOURCE_UPDATED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to update text source");
    },
  });
};

// Delete a text source
export const useDeleteTextSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => TextSourcesService.deleteTextSource(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: ["text-source", id],
      });

      // Invalidate text sources list
      queryClient.invalidateQueries({
        queryKey: ["text-sources"],
      });

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.SOURCE_DELETED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to delete text source");
    },
  });
};
