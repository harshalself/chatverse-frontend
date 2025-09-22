import { useQuery } from "@tanstack/react-query";
import { useAgents } from "@/hooks/use-agents";
import { QUERY_KEYS } from "@/lib/constants";
import { DataSource, BaseSource } from "@/types/source.types";

// Helper function to transform BaseSource to DataSource for UI compatibility (same as use-base-sources.ts)
const transformToDataSource = (baseSource: BaseSource): DataSource => {
  const base: DataSource = {
    ...baseSource,
    type: baseSource.source_type,
  };

  // Handle website source specific fields
  if (baseSource.source_type === "website" && "page_count" in baseSource) {
    base.pageCount = (baseSource as any).page_count;
  }

  // Handle database source specific fields
  if (baseSource.source_type === "database" && "record_count" in baseSource) {
    base.recordCount = (baseSource as any).record_count;
  }

  // Initialize metadata as empty object by default
  base.metadata = {};

  return base;
};

// Create a helper function to get count from metadata or properties (same as SourcesSummary)
const getSourceCount = (source: DataSource): number => {
  // For TextSource, FileSource, QASource: count as 1 per source
  if (
    source.type === "text" ||
    source.type === "file" ||
    source.type === "qa"
  ) {
    return 1;
  }

  // For WebsiteSource - if we don't have page count data yet, count as 1 source
  if (source.type === "website") {
    const pageCount =
      source.pageCount ||
      source.metadata?.pageCount ||
      (source as any).page_count ||
      source.metadata?.page_count;

    // If pageCount is available and > 0, use it; otherwise count as 1 source
    return pageCount && pageCount > 0 ? pageCount : 1;
  }

  // For DatabaseSource - if we don't have record count data yet, count as 1 source
  if (source.type === "database") {
    const recordCount =
      source.recordCount ||
      source.metadata?.recordCount ||
      (source as any).record_count ||
      source.metadata?.record_count;

    // If recordCount is available and > 0, use it; otherwise count as 1 source
    return recordCount && recordCount > 0 ? recordCount : 1;
  }

  // Default fallback
  return 1;
};

/**
 * Custom hook to calculate total sources across all user's agents
 * Uses the same counting logic as SourcesSummary component
 */
export const useTotalSources = () => {
  // First get all agents using the same pattern as UsageView
  const {
    data: agentsData,
    isLoading: agentsLoading,
    error: agentsError,
  } = useAgents();

  // Extract agent IDs with robust fallback pattern
  const agents = Array.isArray(agentsData)
    ? agentsData
    : Array.isArray(agentsData?.data)
    ? agentsData.data
    : Array.isArray(agentsData?.agents)
    ? agentsData.agents
    : [];

  const agentIds = agents.map((agent) => agent.id);

  // Create a combined query that fetches sources for all agents
  return useQuery({
    queryKey: [...QUERY_KEYS.SOURCES, "total-count", agentIds],
    queryFn: async () => {
      if (!agentIds.length) return 0;

      // Import the service directly to avoid hook rules issues
      const { BaseSourcesService } = await import(
        "@/services/sources/base.service"
      );

      let totalSources = 0;

      // Fetch sources for each agent and sum them up using the same logic as SourcesSummary
      const sourcePromises = agentIds.map(async (agentId) => {
        try {
          const sourcesResponse = await BaseSourcesService.getSourcesByAgent(
            agentId
          );
          const sources = sourcesResponse?.data || [];

          // Transform BaseSource to DataSource and use the same counting logic as SourcesSummary
          const transformedSources = sources.map(transformToDataSource);
          return transformedSources.reduce(
            (acc, source) => acc + getSourceCount(source),
            0
          );
        } catch (error) {
          // If error fetching sources for an agent, return 0
          console.warn(`Failed to fetch sources for agent ${agentId}:`, error);
          return 0;
        }
      });

      const sourceCounts = await Promise.all(sourcePromises);
      totalSources = sourceCounts.reduce((sum, count) => sum + count, 0);

      return totalSources;
    },
    enabled: !!agentIds.length && !agentsLoading && !agentsError,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 2,
  });
};
