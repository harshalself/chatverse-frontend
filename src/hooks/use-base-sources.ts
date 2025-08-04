import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BaseSourcesService } from "@/services/sources/base.service";
import { DataSource, BaseSource } from "@/types/source.types";
import { QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { ErrorHandler } from "@/lib/error-handler";
import { toast } from "@/hooks/use-toast";

// Helper function to transform BaseSource to DataSource for UI compatibility
const transformToDataSource = (baseSource: BaseSource): DataSource => {
  let metadata: Record<string, any> = {};

  try {
    if (baseSource.processing_metadata) {
      metadata = JSON.parse(baseSource.processing_metadata);
    }
  } catch (error) {
    console.warn("Failed to parse processing_metadata:", error);
  }

  return {
    ...baseSource,
    type: baseSource.source_type,
    name:
      metadata.name ||
      metadata.fileName ||
      `${baseSource.source_type} source ${baseSource.id}`,
    metadata,
    // Legacy properties for specific source types
    pageCount: metadata.pageCount,
    recordCount: metadata.recordCount,
    questions: metadata.questions,
  };
};

// Get sources for a specific agent
export const useSourcesByAgent = (agentId: number, enabled = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SOURCES, "by-agent", agentId],
    queryFn: async () => {
      const response = await BaseSourcesService.getSourcesByAgent(agentId);
      return response.data.map(transformToDataSource);
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
      const response = await BaseSourcesService.getSourcesByAgent(agentId);
      return response.data.map(transformToDataSource);
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
