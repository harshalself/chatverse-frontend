import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QASourcesService } from "../services/sources/qa.service";
import {
  CreateQASourceRequest,
  UpdateQASourceRequest,
} from "../types/source.types";
import { QUERY_KEYS } from "../lib/constants";
import { useToast } from "./use-toast";

export const useCreateQASource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: QASourcesService.createQASource,
    onSuccess: (data, variables) => {
      // Invalidate both the specific QA sources query and the base sources query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SOURCES,
      });

      toast({
        title: "QA Source Created",
        description: "QA source has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create QA source.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateQASource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateQASourceRequest }) =>
      QASourcesService.updateQASource(id, data),
    onSuccess: (data, variables) => {
      // Invalidate both the specific QA sources query and the base sources query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SOURCES,
      });

      toast({
        title: "QA Source Updated",
        description: "QA source has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update QA source.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteQASource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: QASourcesService.deleteQASource,
    onSuccess: () => {
      // Invalidate both the specific QA sources query and the base sources query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.SOURCES,
      });

      toast({
        title: "QA Source Deleted",
        description: "QA source has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete QA source.",
        variant: "destructive",
      });
    },
  });
};
