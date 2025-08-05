import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileSourcesService } from "@/services/sources";
import { FileSource, UpdateFileSourceRequest } from "@/types/source.types";
import { QUERY_KEYS, SUCCESS_MESSAGES } from "@/lib/constants";
import { ErrorHandler } from "@/lib/error-handler";
import { toast } from "@/hooks/use-toast";

// File Source API Hooks

// Get file sources for an agent
export const useFileSources = (agentId: number, enabled = true) => {
  return useQuery({
    queryKey: ["file-sources", agentId],
    queryFn: async () => {
      if (!agentId) {
        return [];
      }
      const fileSources = await FileSourcesService.getFileSources(agentId);
      return fileSources || [];
    },
    enabled: enabled && !!agentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get a single file source
export const useFileSource = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["file-source", id],
    queryFn: () => FileSourcesService.getFileSource(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Upload a single file source
export const useUploadFileSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      file,
      name,
      description,
      onProgress,
    }: {
      agentId: number;
      file: File;
      name?: string;
      description?: string;
      onProgress?: (progress: number) => void;
    }) =>
      FileSourcesService.uploadFileSource(
        agentId,
        file,
        name,
        description,
        onProgress
      ),
    onSuccess: (fileSource: FileSource, variables) => {
      // Invalidate file sources list for the agent
      queryClient.invalidateQueries({
        queryKey: ["file-sources", variables.agentId],
      });

      // Add to cache
      queryClient.setQueryData(["file-source", fileSource.id], fileSource);

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.FILE_UPLOADED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to upload file");
    },
  });
};

// Upload multiple file sources
export const useUploadMultipleFileSources = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      files,
      names,
      descriptions,
      onProgress,
    }: {
      agentId: number;
      files: File[];
      names: string[];
      descriptions?: string[];
      onProgress?: (fileIndex: number, progress: number) => void;
    }) =>
      FileSourcesService.uploadMultipleFileSources(
        agentId,
        files,
        names,
        descriptions,
        onProgress
      ),
    onSuccess: (fileSources: FileSource[], variables) => {
      // Invalidate file sources list for the agent
      queryClient.invalidateQueries({
        queryKey: ["file-sources", variables.agentId],
      });

      // Add each file to cache
      fileSources.forEach((fileSource) => {
        queryClient.setQueryData(["file-source", fileSource.id], fileSource);
      });

      toast({
        title: "Success",
        description: `${fileSources.length} files uploaded successfully`,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to upload files");
    },
  });
};

// Update a file source
export const useUpdateFileSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFileSourceRequest }) =>
      FileSourcesService.updateFileSource(id, data),
    onSuccess: (fileSource: FileSource) => {
      // Update cache
      queryClient.setQueryData(["file-source", fileSource.id], fileSource);

      // Invalidate file sources list
      queryClient.invalidateQueries({
        queryKey: ["file-sources"],
      });

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.SOURCE_UPDATED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to update file source");
    },
  });
};

// Delete a file source
export const useDeleteFileSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => FileSourcesService.deleteFileSource(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: ["file-source", id],
      });

      // Invalidate file sources list
      queryClient.invalidateQueries({
        queryKey: ["file-sources"],
      });

      toast({
        title: "Success",
        description: SUCCESS_MESSAGES.SOURCE_DELETED,
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to delete file source");
    },
  });
};

// Export file source
export const useExportFileSource = () => {
  return useMutation({
    mutationFn: ({
      id,
      format = "json",
    }: {
      id: number;
      format?: "json" | "csv" | "txt";
    }) => FileSourcesService.exportFileSource(id, format),
    onSuccess: (blob: Blob, { id, format }) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `file-source-${id}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File source exported successfully",
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to export file source");
    },
  });
};
