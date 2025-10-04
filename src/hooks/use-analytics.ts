import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { QUERY_KEYS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import { ErrorHandler } from "@/lib/error-handler";
import {
  Timeframe,
  AgentComparisonRequest,
  AnalyticsOverview,
} from "@/types/analytics.types";

// ===============================
// Agent Performance Hooks
// ===============================

/**
 * Get performance metrics for a specific agent
 */
export const useAgentPerformance = (
  agentId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "agent-performance", agentId],
    queryFn: () => AnalyticsService.getAgentPerformance(agentId),
    enabled: enabled && !!agentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 2,
  });
};

/**
 * Compare performance metrics between multiple agents
 */
export const useAgentComparison = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AgentComparisonRequest) =>
      AnalyticsService.compareAgents(data),
    onSuccess: (response) => {
      // Cache the comparison results
      queryClient.setQueryData(
        [...QUERY_KEYS.ANALYTICS, "agent-comparison", response],
        response
      );
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to compare agents");
    },
  });
};

/**
 * Get top performing agents ranking
 */
export const useTopPerformingAgents = (
  limit: number = 10,
  timeframe: Timeframe = "7d",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "top-agents", limit, timeframe],
    queryFn: () => AnalyticsService.getTopPerformingAgents(limit, timeframe),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 2,
  });
};

/**
 * Get optimization recommendations for an agent
 */
export const useAgentOptimization = (
  agentId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "agent-optimization", agentId],
    queryFn: () => AnalyticsService.getAgentOptimization(agentId),
    enabled: enabled && !!agentId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    retry: 2,
  });
};

// ===============================
// Model Usage Hooks
// ===============================

/**
 * Get model usage statistics
 */
export const useModelUsage = (
  timeframe: Timeframe = "7d",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "model-usage", timeframe],
    queryFn: () => AnalyticsService.getModelUsage(timeframe),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 2,
  });
};

/**
 * Get detailed cost analysis for all models
 */
export const useModelCosts = (
  timeframe: Timeframe = "30d",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "model-costs", timeframe],
    queryFn: () => AnalyticsService.getModelCosts(timeframe),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 20 * 60 * 1000, // Refetch every 20 minutes
    retry: 2,
  });
};

/**
 * Get model performance comparison
 */
export const useModelPerformance = (
  timeframe: Timeframe = "7d",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "model-performance", timeframe],
    queryFn: () => AnalyticsService.getModelPerformance(timeframe),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 2,
  });
};

// ===============================
// System Performance Hooks
// ===============================

/**
 * Get overall system performance metrics
 */
export const useSystemPerformance = (
  timeframe: Timeframe = "7d",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "system-performance", timeframe],
    queryFn: () => AnalyticsService.getSystemPerformance(timeframe),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
  });
};

// ===============================
// User Behavior Hooks (Phase 2)
// ===============================

/**
 * Get user engagement metrics
 */
export const useUserEngagement = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "user-engagement"],
    queryFn: () => AnalyticsService.getUserEngagement(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
    retry: 2,
  });
};

/**
 * Get user behavior insights with cohort analysis
 */
export const useUserBehavior = (
  timeframe: Timeframe = "30d",
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "user-behavior", timeframe, limit],
    queryFn: () => AnalyticsService.getUserBehavior(timeframe, limit),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// ===============================
// Aggregated Analytics Hooks
// ===============================

/**
 * Get aggregated analytics overview for dashboard cards
 */
export const useAnalyticsOverview = (
  timeframe: Timeframe = "7d",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, "overview", timeframe],
    queryFn: () => AnalyticsService.getAnalyticsOverview(timeframe),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 2,
    select: (data: AnalyticsOverview) => ({
      ...data,
      // Format numbers for display
      avgResponseTime: Math.round(data.avgResponseTime),
      successRate: Math.round(data.successRate * 10) / 10, // 1 decimal place
      totalCost: Math.round(data.totalCost * 100) / 100, // 2 decimal places
      costEfficiency: Math.round(data.costEfficiency * 100) / 100,
    }),
  });
};

// ===============================
// Utility Hooks
// ===============================

/**
 * Refresh all analytics data
 */
export const useRefreshAnalytics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Invalidate all analytics queries
      await queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.ANALYTICS 
      });
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Analytics Refreshed",
        description: "All analytics data has been updated with the latest information.",
      });
    },
    onError: (error) => {
      ErrorHandler.handleApiError(error, "Failed to refresh analytics");
    },
  });
};

/**
 * Get available timeframe options for UI
 */
export const useTimeframeOptions = () => {
  return AnalyticsService.getAvailableTimeframes();
};

// ===============================
// Prefetch Hooks for Performance
// ===============================

/**
 * Prefetch analytics data for faster loading
 */
export const usePrefetchAnalytics = () => {
  const queryClient = useQueryClient();

  const prefetchOverview = async (timeframe: Timeframe = "7d") => {
    await queryClient.prefetchQuery({
      queryKey: [...QUERY_KEYS.ANALYTICS, "overview", timeframe],
      queryFn: () => AnalyticsService.getAnalyticsOverview(timeframe),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchTopAgents = async (timeframe: Timeframe = "7d") => {
    await queryClient.prefetchQuery({
      queryKey: [...QUERY_KEYS.ANALYTICS, "top-agents", 10, timeframe],
      queryFn: () => AnalyticsService.getTopPerformingAgents(10, timeframe),
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchModelUsage = async (timeframe: Timeframe = "7d") => {
    await queryClient.prefetchQuery({
      queryKey: [...QUERY_KEYS.ANALYTICS, "model-usage", timeframe],
      queryFn: () => AnalyticsService.getModelUsage(timeframe),
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    prefetchOverview,
    prefetchTopAgents,
    prefetchModelUsage,
  };
};