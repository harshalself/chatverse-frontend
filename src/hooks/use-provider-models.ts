import { useQuery } from "@tanstack/react-query";
import { ProviderModelsService, ProviderModel } from "@/services/provider-models.service";
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
    queryKey: [...QUERY_KEYS.PROVIDER_MODELS, 'all'],
    queryFn: () => ProviderModelsService.getAllModels(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Extract unique providers and format them
  const providers = query.data?.data
    .filter(model => !model.is_deleted)
    .reduce((acc: FormattedProvider[], model) => {
      if (!acc.find(p => p.provider === model.provider)) {
        acc.push({
          provider: model.provider,
          displayName: model.provider.charAt(0).toUpperCase() + model.provider.slice(1)
        });
      }
      return acc;
    }, []) || [];

  return {
    ...query,
    data: { data: providers, message: query.data?.message || "" }
  };
}

/**
 * Hook to get models for a specific provider
 */
export function useProviderModels(provider?: string) {
  const query = useQuery({
    queryKey: provider ? [...QUERY_KEYS.PROVIDER_MODELS, provider] : QUERY_KEYS.PROVIDER_MODELS,
    queryFn: () => provider ? ProviderModelsService.getModelsByProvider(provider) : null,
    enabled: !!provider, // Only fetch when provider is available
    staleTime: 60 * 1000, // Cache for 1 minute
  });

  // Filter out deleted models
  const models = query.data?.data.filter(model => 
    !model.is_deleted
  ) || [];

  return {
    ...query,
    data: query.data ? { ...query.data, data: models } : undefined
  };
}
