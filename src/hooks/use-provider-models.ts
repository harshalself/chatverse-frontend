import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProviderModelsService } from "@/services/provider-models.service";
import {
  ProviderModel,
  CreateProviderModelRequest,
  UpdateProviderModelRequest,
} from "@/types/common.types";
import { QUERY_KEYS } from "@/lib/constants";

interface FormattedProvider {
  provider: string;
  displayName: string;
}

/**
 * Hook to get all available providers from the models list
 */
export function useProviders() {
  const query = useQuery({
    queryKey: [...QUERY_KEYS.PROVIDER_MODELS, "all"],
    queryFn: async () => {
      console.log("🔍 Fetching all provider models...");
      const data = await ProviderModelsService.getAllModels();
      console.log("📋 Raw provider models data:", data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Extract unique providers and format them
  const providers =
    query.data
      ?.filter(
        (model) =>
          !model.is_deleted && model.provider && model.provider.trim() !== ""
      )
      .reduce((acc: FormattedProvider[], model) => {
        if (!acc.find((p) => p.provider === model.provider)) {
          acc.push({
            provider: model.provider,
            displayName:
              model.provider.charAt(0).toUpperCase() + model.provider.slice(1),
          });
        }
        return acc;
      }, []) || [];

  console.log("🏢 Processed providers:", providers);
  console.log("🔄 Query state:", {
    isLoading: query.isLoading,
    error: query.error,
    dataLength: query.data?.length,
  });

  return {
    ...query,
    data: { data: providers },
  };
}

/**
 * Hook to get models for a specific provider
 */
export function useProviderModels(provider?: string) {
  const query = useQuery({
    queryKey: provider
      ? [...QUERY_KEYS.PROVIDER_MODELS, provider]
      : QUERY_KEYS.PROVIDER_MODELS,
    queryFn: () =>
      provider ? ProviderModelsService.getModelsByProvider(provider) : null,
    enabled: !!provider, // Only fetch when provider is available
    staleTime: 60 * 1000, // Cache for 1 minute
  });

  // Filter out deleted models and ensure model_name is not empty
  const models =
    query.data?.filter(
      (model) =>
        !model.is_deleted && model.model_name && model.model_name.trim() !== ""
    ) || [];

  return {
    ...query,
    data: { data: models },
  };
}

/**
 * Hook to get all provider models
 */
export function useAllProviderModels() {
  return useQuery({
    queryKey: QUERY_KEYS.PROVIDER_MODELS,
    queryFn: () => ProviderModelsService.getAllModels(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to get a single provider model by ID
 */
export function useProviderModel(id: number) {
  return useQuery({
    queryKey: [...QUERY_KEYS.PROVIDER_MODELS, id],
    queryFn: () => ProviderModelsService.getModel(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a provider model
 */
export function useCreateProviderModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProviderModelRequest) =>
      ProviderModelsService.createModel(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDER_MODELS });
    },
  });
}

/**
 * Hook to update a provider model
 */
export function useUpdateProviderModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: UpdateProviderModelRequest;
    }) => ProviderModelsService.updateModel(id, request),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDER_MODELS });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.PROVIDER_MODELS, id],
      });
    },
  });
}

/**
 * Hook to delete a provider model
 */
export function useDeleteProviderModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ProviderModelsService.deleteModel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROVIDER_MODELS });
    },
  });
}
