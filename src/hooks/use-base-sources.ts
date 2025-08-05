import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseSourcesService } from "@/services/sources/base.service";
import {
  DataSource,
  BaseSource,
  CreateSourceRequest,
  UpdateSourceRequest,
} from "@/types/source.types";
import { QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { ErrorHandler } from "@/lib/error-handler";
import { toast } from "@/hooks/use-toast";

// Helper function to transform BaseSource to DataSource for UI compatibility
const transformToDataSource = (baseSource: BaseSource): DataSource => ({
  ...baseSource,
  type: baseSource.source_type,
});

// Get sources for a specific agent
export const useSourcesByAgent = (agentId: number, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SOURCES, "by-agent", agentId],
    queryFn: async () => {
      if (!agentId) {
        return [];
      }
      const response = await BaseSourcesService.getSourcesByAgent(agentId);
      // Ensure we always return an array and handle undefined data
      const sources = response.data || [];
      return sources.map(transformToDataSource);
    },
    enabled: enabled && !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all sources (for AllSourcesTable)
export const useAllSources = (agentId: number, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SOURCES, "all", agentId],
    queryFn: async () => {
      if (!agentId) {
        return [];
      }
      const response = await BaseSourcesService.getSourcesByAgent(agentId);
      // Ensure we always return an array and handle undefined data
      const sources = response.data || [];
      return sources.map(transformToDataSource);
    },
    enabled: enabled && !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get single source
export const useBaseSource = (id: number, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.SOURCE(String(id)),
    queryFn: async () => {
      const response = await BaseSourcesService.getSource(id);
      return transformToDataSource(response.data);
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Delete source mutation
export const useDeleteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => BaseSourcesService.deleteSource(id),
    onSuccess: (response, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.SOURCE(String(deletedId)),
      });

      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });

      toast({
        title: "Success",
        description: response.message || SUCCESS_MESSAGES.SOURCE_DELETED,
      });
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to delete source");
    },
  });
};

// Create source mutation
export const useCreateBaseSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      data,
    }: {
      agentId: number;
      data: CreateSourceRequest;
    }) => BaseSourcesService.createSource(agentId, data),
    onSuccess: (response, { agentId }) => {
      // Invalidate sources list for the agent
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.SOURCES, "by-agent", agentId],
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.SOURCES, "all", agentId],
      });

      toast({
        title: "Success",
        description: response.message || SUCCESS_MESSAGES.SOURCE_CREATED,
      });
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to create source");
    },
  });
};

// Update source mutation
export const useUpdateBaseSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSourceRequest }) =>
      BaseSourcesService.updateSource(id, data),
    onSuccess: (response, { id }) => {
      // Update cached source
      queryClient.setQueryData(QUERY_KEYS.SOURCE(String(id)), () =>
        transformToDataSource(response.data)
      );

      // Invalidate sources lists
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });

      toast({
        title: "Success",
        description: response.message || SUCCESS_MESSAGES.SOURCE_UPDATED,
      });
    },
    onError: (error: any) => {
      ErrorHandler.handleApiError(error, "Failed to update source");
    },
  });
};
