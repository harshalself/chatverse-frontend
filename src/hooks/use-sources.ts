import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  SourcesService,
  CreateSourceRequest,
  UpdateSourceRequest,
  WebsiteSourceRequest,
  DatabaseSourceRequest,
  QASourceRequest,
} from "@/services/sources.service";
import { QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { DataSource } from "@/types/common.types";
import { PaginatedResponse, PaginationOptions } from "@/types/api.types";

// Get all sources with pagination
export const useSources = (options?: PaginationOptions) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SOURCES, options],
    queryFn: () => SourcesService.getSources(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Get sources with infinite loading
export const useInfiniteSources = (
  options?: Omit<PaginationOptions, "page">
) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.SOURCES, "infinite", options],
    queryFn: ({ pageParam = 1 }) =>
      SourcesService.getSources({ ...options, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: PaginatedResponse<DataSource>) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Get single source
export const useSource = (id: string, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.SOURCE(id),
    queryFn: () => SourcesService.getSource(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get sources by type
export const useSourcesByType = (
  type: DataSource["type"],
  options?: PaginationOptions
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SOURCES, "by-type", type, options],
    queryFn: () => SourcesService.getSourcesByType(type, options),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

// Create text source mutation
export const useCreateTextSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSourceRequest) =>
      SourcesService.createTextSource(data),
    onSuccess: (newSource: DataSource) => {
      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });

      // Add to cache
      queryClient.setQueryData(QUERY_KEYS.SOURCE(newSource.id), newSource);

      toast({ title: "Success", description: SUCCESS_MESSAGES.SOURCE_CREATED });
    },
    onError: (error) => {
      console.error("Create text source error:", error);
    },
  });
};

// Create website source mutation
export const useCreateWebsiteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WebsiteSourceRequest) =>
      SourcesService.createWebsiteSource(data),
    onSuccess: (newSource: DataSource) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });
      queryClient.setQueryData(QUERY_KEYS.SOURCE(newSource.id), newSource);
      toast({ title: "Success", description: SUCCESS_MESSAGES.SOURCE_CREATED });
    },
    onError: (error) => {
      console.error("Create website source error:", error);
    },
  });
};

// Create database source mutation
export const useCreateDatabaseSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DatabaseSourceRequest) =>
      SourcesService.createDatabaseSource(data),
    onSuccess: (newSource: DataSource) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });
      queryClient.setQueryData(QUERY_KEYS.SOURCE(newSource.id), newSource);
      toast({ title: "Success", description: SUCCESS_MESSAGES.SOURCE_CREATED });
    },
    onError: (error) => {
      console.error("Create database source error:", error);
    },
  });
};

// Create Q&A source mutation
export const useCreateQASource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: QASourceRequest) => SourcesService.createQASource(data),
    onSuccess: (newSource: DataSource) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });
      queryClient.setQueryData(QUERY_KEYS.SOURCE(newSource.id), newSource);
      toast({ title: "Success", description: SUCCESS_MESSAGES.SOURCE_CREATED });
    },
    onError: (error) => {
      console.error("Create Q&A source error:", error);
    },
  });
};

// Upload file mutation
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      name,
      onProgress,
    }: {
      file: File;
      name?: string;
      onProgress?: (progress: number) => void;
    }) => SourcesService.uploadFile(file, name, onProgress),
    onSuccess: (newSource: DataSource) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });
      queryClient.setQueryData(QUERY_KEYS.SOURCE(newSource.id), newSource);
      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.FILE_UPLOADED,
      });
    },
    onError: (error) => {
      console.error("Upload file error:", error);
    },
  });
};

// Upload multiple files mutation
export const useUploadMultipleFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      files,
      onProgress,
    }: {
      files: File[];
      onProgress?: (fileIndex: number, progress: number) => void;
    }) => SourcesService.uploadMultipleFiles(files, onProgress),
    onSuccess: (newSources: DataSource[]) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });

      // Add all sources to cache
      newSources.forEach((source) => {
        queryClient.setQueryData(QUERY_KEYS.SOURCE(source.id), source);
      });

      toast({
        title: "Success",
        description: `${newSources.length} files uploaded successfully`,
      });
    },
    onError: (error) => {
      console.error("Upload multiple files error:", error);
    },
  });
};

// Update source mutation
export const useUpdateSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSourceRequest }) =>
      SourcesService.updateSource(id, data),
    onSuccess: (updatedSource: DataSource) => {
      // Update source in cache
      queryClient.setQueryData(
        QUERY_KEYS.SOURCE(updatedSource.id),
        updatedSource
      );

      // Invalidate sources list to ensure consistency
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });

      toast({ title: "Success", description: SUCCESS_MESSAGES.SOURCE_UPDATED });
    },
    onError: (error) => {
      console.error("Update source error:", error);
    },
  });
};

// Delete source mutation
export const useDeleteSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => SourcesService.deleteSource(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.SOURCE(deletedId) });

      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });

      toast({ title: "Success", description: SUCCESS_MESSAGES.SOURCE_DELETED });
    },
    onError: (error) => {
      console.error("Delete source error:", error);
    },
  });
};

// Bulk delete sources mutation
export const useBulkDeleteSources = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => SourcesService.bulkDeleteSources(ids),
    onSuccess: (result, deletedIds) => {
      // Remove all deleted sources from cache
      result.deleted.forEach((id) => {
        queryClient.removeQueries({ queryKey: QUERY_KEYS.SOURCE(id) });
      });

      // Invalidate sources list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SOURCES });

      const successCount = result.deleted.length;
      const failedCount = result.failed.length;

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} sources deleted successfully`,
        });
      }

      if (failedCount > 0) {
        console.warn("Failed to delete some sources:", result.failed);
      }
    },
    onError: (error) => {
      console.error("Bulk delete sources error:", error);
    },
  });
};

// Process source mutation
export const useProcessSource = () => {
  return useMutation({
    mutationFn: (id: string) => SourcesService.processSource(id),
    onSuccess: () => {
      toast({ title: "Success", description: "Source processing started" });
    },
    onError: (error) => {
      console.error("Process source error:", error);
    },
  });
};

// Get processing status
export const useProcessingStatus = (
  sourceId: string,
  taskId: string,
  enabled = true
) => {
  return useQuery({
    queryKey: ["processing-status", sourceId, taskId],
    queryFn: () => SourcesService.getProcessingStatus(sourceId, taskId),
    enabled: enabled && !!sourceId && !!taskId,
    refetchInterval: (query) => {
      // Poll every 2 seconds if processing is in progress
      const data = query.state.data;
      return data?.status === "processing" || data?.status === "pending"
        ? 2000
        : false;
    },
  });
};

// Test website connection mutation
export const useTestWebsiteConnection = () => {
  return useMutation({
    mutationFn: (url: string) => SourcesService.testWebsiteConnection(url),
    onSuccess: (result) => {
      if (result.accessible) {
        toast({ title: "Success", description: "Website is accessible" });
      }
    },
    onError: (error) => {
      console.error("Test website connection error:", error);
    },
  });
};

// Test database connection mutation
export const useTestDatabaseConnection = () => {
  return useMutation({
    mutationFn: (connectionString: string) =>
      SourcesService.testDatabaseConnection(connectionString),
    onSuccess: (result) => {
      if (result.connected) {
        toast({
          title: "Success",
          description: "Database connection successful",
        });
      }
    },
    onError: (error) => {
      console.error("Test database connection error:", error);
    },
  });
};

// Get source preview
export const useSourcePreview = (
  id: string,
  maxLength = 1000,
  enabled = true
) => {
  return useQuery({
    queryKey: ["source-preview", id, maxLength],
    queryFn: () => SourcesService.getSourcePreview(id, maxLength),
    enabled: enabled && !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search sources
export const useSearchSources = (
  query: string,
  sourceIds?: string[],
  options?: PaginationOptions,
  enabled = true
) => {
  return useQuery({
    queryKey: ["search-sources", query, sourceIds, options],
    queryFn: () => SourcesService.searchSources(query, sourceIds, options),
    enabled: enabled && !!query.trim(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Export source mutation
export const useExportSource = () => {
  return useMutation({
    mutationFn: ({
      id,
      format = "json",
    }: {
      id: string;
      format?: "json" | "csv" | "txt";
    }) => SourcesService.exportSource(id, format),
    onSuccess: (blob: Blob, { id, format }) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `source-${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Source data exported successfully",
      });
    },
    onError: (error) => {
      console.error("Export source error:", error);
    },
  });
};

// Get source statistics
export const useSourceStatistics = () => {
  return useQuery({
    queryKey: ["source-statistics"],
    queryFn: SourcesService.getSourceStatistics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Specialized hooks for different source types

// File sources hook
export const useFileSources = (options?: PaginationOptions) => {
  return useSourcesByType("file", options);
};

// Text sources hook
export const useTextSources = (options?: PaginationOptions) => {
  return useSourcesByType("text", options);
};

// Website sources hook
export const useWebsiteSources = (options?: PaginationOptions) => {
  return useSourcesByType("website", options);
};

// Database sources hook
export const useDatabaseSources = (options?: PaginationOptions) => {
  return useSourcesByType("database", options);
};

// Q&A sources hook
export const useQASources = (options?: PaginationOptions) => {
  return useSourcesByType("qa", options);
};

// Recent sources hook
export const useRecentSources = (limit: number = 10) => {
  return useQuery({
    queryKey: ["recent-sources", limit],
    queryFn: () =>
      SourcesService.getSources({
        page: 1,
        limit,
        sort: { field: "createdAt", direction: "desc" },
      }),
    staleTime: 60 * 1000, // 1 minute
    select: (data) => data.data, // Extract just the sources array
  });
};
