import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardService } from "@/services/dashboard.service";
import { QUERY_KEYS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

// Get dashboard overview
export const useDashboardOverview = (
  timeRange: "24h" | "7d" | "30d" | "90d" = "7d"
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, "overview", timeRange],
    queryFn: () => DashboardService.getOverview(timeRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Get analytics data
export const useAnalytics = (
  timeRange: "24h" | "7d" | "30d" | "90d" = "7d"
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, timeRange],
    queryFn: () => DashboardService.getAnalytics(timeRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Get activity logs
export const useActivityLogs = (options?: {
  page?: number;
  limit?: number;
  type?:
    | "agent_created"
    | "conversation_started"
    | "message_sent"
    | "source_uploaded"
    | "user_registered";
  userId?: string;
  agentId?: string;
  from?: string;
  to?: string;
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ACTIVITY, options],
    queryFn: () => DashboardService.getActivityLogs(options),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Get usage statistics
export const useUsageStatistics = (
  timeRange: "24h" | "7d" | "30d" | "90d" = "30d"
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USAGE, timeRange],
    queryFn: () => DashboardService.getUsageStatistics(timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Get real-time metrics
export const useRealTimeMetrics = () => {
  return useQuery({
    queryKey: ["realtime-metrics"],
    queryFn: DashboardService.getRealTimeMetrics,
    staleTime: 0, // Always fresh
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

// Get performance metrics
export const usePerformanceMetrics = (
  timeRange: "1h" | "24h" | "7d" = "24h"
) => {
  return useQuery({
    queryKey: ["performance-metrics", timeRange],
    queryFn: () => DashboardService.getPerformanceMetrics(timeRange),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Get top performing agents
export const useTopAgents = (
  metric:
    | "conversations"
    | "messages"
    | "satisfaction"
    | "response_time" = "conversations",
  limit: number = 10,
  timeRange: "24h" | "7d" | "30d" = "7d"
) => {
  return useQuery({
    queryKey: ["top-agents", metric, limit, timeRange],
    queryFn: () => DashboardService.getTopAgents(metric, limit, timeRange),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};

// Get user engagement metrics
export const useUserEngagement = (timeRange: "7d" | "30d" | "90d" = "30d") => {
  return useQuery({
    queryKey: ["user-engagement", timeRange],
    queryFn: () => DashboardService.getUserEngagement(timeRange),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });
};

// Get conversation insights
export const useConversationInsights = (
  timeRange: "7d" | "30d" | "90d" = "30d"
) => {
  return useQuery({
    queryKey: ["conversation-insights", timeRange],
    queryFn: () => DashboardService.getConversationInsights(timeRange),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });
};

// Get error analytics
export const useErrorAnalytics = (timeRange: "24h" | "7d" | "30d" = "7d") => {
  return useQuery({
    queryKey: ["error-analytics", timeRange],
    queryFn: () => DashboardService.getErrorAnalytics(timeRange),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Get system health
export const useSystemHealth = () => {
  return useQuery({
    queryKey: ["system-health"],
    queryFn: DashboardService.getSystemHealth,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

// Export dashboard data mutation
export const useExportDashboardData = () => {
  return useMutation({
    mutationFn: ({
      type,
      format = "csv",
      timeRange = "30d",
    }: {
      type: "analytics" | "activity" | "usage";
      format?: "csv" | "json" | "pdf";
      timeRange?: "24h" | "7d" | "30d" | "90d";
    }) => DashboardService.exportDashboardData(type, format, timeRange),
    onSuccess: (blob: Blob, { type, format, timeRange }) => {
      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `dashboard-${type}-${timeRange}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: `${type} data exported successfully`,
      });
    },
    onError: (error) => {
      console.error("Export dashboard data error:", error);
    },
  });
};

// Hooks for specific dashboard widgets

// Activity feed with real-time updates
export const useActivityFeed = (limit: number = 20) => {
  return useQuery({
    queryKey: ["activity-feed", limit],
    queryFn: () => DashboardService.getActivityLogs({ limit, page: 1 }),
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

// Summary stats for cards
export const useSummaryStats = () => {
  return useQuery({
    queryKey: ["summary-stats"],
    queryFn: () => DashboardService.getOverview("24h"),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    select: (data) => ({
      totalAgents: data.totalAgents,
      totalConversations: data.totalConversations,
      totalMessages: data.totalMessages,
      activeAgents: data.activeAgents,
      averageResponseTime: data.averageResponseTime,
      successRate: data.successRate,
    }),
  });
};

// Recent activity with optimistic updates
export const useRecentActivity = () => {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: () => DashboardService.getActivityLogs({ limit: 10, page: 1 }),
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 45 * 1000, // Refetch every 45 seconds
    select: (data) => data.data, // Extract just the activity array
  });
};

// Performance summary
export const usePerformanceSummary = () => {
  return useQuery({
    queryKey: ["performance-summary"],
    queryFn: () => DashboardService.getPerformanceMetrics("24h"),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    select: (data) => ({
      averageResponseTime:
        data.averageResponseTime[data.averageResponseTime.length - 1]?.value ||
        0,
      throughput: data.throughput[data.throughput.length - 1]?.value || 0,
      errorRate: data.errorRate[data.errorRate.length - 1]?.value || 0,
      cpuUsage: data.cpuUsage[data.cpuUsage.length - 1]?.value || 0,
      memoryUsage: data.memoryUsage[data.memoryUsage.length - 1]?.value || 0,
      diskUsage: data.diskUsage,
    }),
  });
};
