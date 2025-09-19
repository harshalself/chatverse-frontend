import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebsiteSourcesService } from "@/services/sources";
import {
  WebsiteSource,
  CreateWebsiteSourceRequest,
  UpdateWebsiteSourceRequest,
} from "@/types/source.types";
import { SUCCESS_MESSAGES } from "@/lib/constants";
import { ErrorHandler } from "@/lib/error-handler";
import { toast } from "@/hooks/use-toast";

// Website Source API Hooks

// Get website sources for an agent
export const useWebsiteSources = (agentId: number, enabled = true) => {
  return useQuery({
    queryKey: ["website-sources", agentId],
    queryFn: async () => {
      if (!agentId) {
        return [];
      }
      const websiteSources = await WebsiteSourcesService.getWebsiteSources(
        agentId
      );
      return websiteSources || [];
    },
    enabled: enabled && !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get a single website source
export const useWebsiteSource = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["website-source", id],
    queryFn: () => WebsiteSourcesService.getWebsiteSource(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create a website source
export const useCreateWebsiteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateWebsiteSourceRequest) =>
      WebsiteSourcesService.createWebsiteSource(request),
    onSuccess: (websiteSource: WebsiteSource, variables) => {
      // Invalidate website sources list for the agent
      queryClient.invalidateQueries({
        queryKey: ["website-sources", variables.agent_id],
      });

      // Also invalidate the base sources cache since WebsiteSource component uses that
      queryClient.invalidateQueries({
        queryKey: ["sources", "by-agent", variables.agent_id],
      });

      // Add to cache
      queryClient.setQueryData(
        ["website-source", websiteSource.id],
        websiteSource
      );

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.WEBSITE_SOURCE_CREATED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to create website source");
    },
  });
};

// Update a website source
export const useUpdateWebsiteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateWebsiteSourceRequest;
    }) => WebsiteSourcesService.updateWebsiteSource(id, data),
    onSuccess: (websiteSource: WebsiteSource) => {
      // Update cache
      queryClient.setQueryData(
        ["website-source", websiteSource.id],
        websiteSource
      );

      // Invalidate website sources list
      queryClient.invalidateQueries({
        queryKey: ["website-sources"],
      });

      // Also invalidate the base sources cache since WebsiteSource component uses that
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.SOURCE_UPDATED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to update website source");
    },
  });
};

// Delete a website source
export const useDeleteWebsiteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => WebsiteSourcesService.deleteWebsiteSource(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: ["website-source", id],
      });

      // Invalidate website sources list
      queryClient.invalidateQueries({
        queryKey: ["website-sources"],
      });

      // Also invalidate the base sources cache since WebsiteSource component uses that
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.SOURCE_DELETED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to delete website source");
    },
  });
};

// Test website connection
export const useTestWebsiteConnection = () => {
  return useMutation({
    mutationFn: (url: string) =>
      WebsiteSourcesService.testWebsiteConnection(url),
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to test website connection");
    },
  });
};
