import { apiClient, TokenManager } from "@/lib/api/client";
import { API_ENDPOINTS, APP_CONFIG } from "@/lib/constants";
import { AnalyticsData, TrendData } from "@/types/common.types";
import axios from "axios";

export interface DashboardOverview {
  totalAgents: number;
  totalConversations: number;
  totalMessages: number;
  totalSources: number;
  activeAgents: number;
  averageResponseTime: number;
  successRate: number;
  userSatisfaction: number;
}

export interface ActivityLog {
  id: string;
  type:
    | "agent_created"
    | "conversation_started"
    | "message_sent"
    | "source_uploaded"
    | "user_registered";
  description: string;
  userId: string;
  userName: string;
  agentId?: string;
  agentName?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface UsageStatistics {
  period: string;
  apiCalls: number;
  tokensUsed: number;
  storageUsed: number;
  bandwidth: number;
  costs: {
    api: number;
    storage: number;
    bandwidth: number;
    total: number;
  };
  limits: {
    apiCalls: number;
    tokensUsed: number;
    storageUsed: number;
    bandwidth: number;
  };
}

export class DashboardService {
  /**
   * Get dashboard overview statistics
   */
  static async getOverview(
    timeRange: "24h" | "7d" | "30d" | "90d" = "7d"
  ): Promise<DashboardOverview> {
    return (await apiClient.get(
      `${API_ENDPOINTS.DASHBOARD.ANALYTICS}/overview?timeRange=${timeRange}`
    )) as DashboardOverview;
  }

  /**
   * Get analytics data with trends
   */
  static async getAnalytics(
    timeRange: "24h" | "7d" | "30d" | "90d" = "7d"
  ): Promise<AnalyticsData> {
    return (await apiClient.get(
      `${API_ENDPOINTS.DASHBOARD.ANALYTICS}?timeRange=${timeRange}`
    )) as AnalyticsData;
  }

  /**
   * Get activity logs
   */
  static async getActivityLogs(options?: {
    page?: number;
    limit?: number;
    type?: ActivityLog["type"];
    userId?: string;
    agentId?: string;
    from?: string;
    to?: string;
  }): Promise<{
    data: ActivityLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams();

    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.type) params.append("type", options.type);
    if (options?.userId) params.append("userId", options.userId);
    if (options?.agentId) params.append("agentId", options.agentId);
    if (options?.from) params.append("from", options.from);
    if (options?.to) params.append("to", options.to);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.DASHBOARD.ACTIVITY}?${queryString}`
      : API_ENDPOINTS.DASHBOARD.ACTIVITY;

    return apiClient.get(url);
  }

  /**
   * Get usage statistics
   */
  static async getUsageStatistics(
    timeRange: "24h" | "7d" | "30d" | "90d" = "30d"
  ): Promise<UsageStatistics> {
    return (await apiClient.get(
      `${API_ENDPOINTS.DASHBOARD.USAGE}?timeRange=${timeRange}`
    )) as UsageStatistics;
  }

  /**
   * Get real-time metrics
   */
  static async getRealTimeMetrics(): Promise<{
    activeUsers: number;
    activeAgents: number;
    ongoingConversations: number;
    queuedMessages: number;
    systemHealth: "healthy" | "warning" | "critical";
    lastUpdated: string;
  }> {
    return apiClient.get("/dashboard/realtime");
  }

  /**
   * Get performance metrics
   */
  static async getPerformanceMetrics(
    timeRange: "1h" | "24h" | "7d" = "24h"
  ): Promise<{
    averageResponseTime: TrendData[];
    throughput: TrendData[];
    errorRate: TrendData[];
    cpuUsage: TrendData[];
    memoryUsage: TrendData[];
    diskUsage: number;
  }> {
    return apiClient.get(`/dashboard/performance?timeRange=${timeRange}`);
  }

  /**
   * Get top performing agents
   */
  static async getTopAgents(
    metric:
      | "conversations"
      | "messages"
      | "satisfaction"
      | "response_time" = "conversations",
    limit: number = 10,
    timeRange: "24h" | "7d" | "30d" = "7d"
  ): Promise<
    Array<{
      id: string;
      name: string;
      value: number;
      change: number;
      rank: number;
    }>
  > {
    return apiClient.get(
      `/dashboard/top-agents?metric=${metric}&limit=${limit}&timeRange=${timeRange}`
    );
  }

  /**
   * Get user engagement metrics
   */
  static async getUserEngagement(
    timeRange: "7d" | "30d" | "90d" = "30d"
  ): Promise<{
    dailyActiveUsers: TrendData[];
    weeklyActiveUsers: TrendData[];
    monthlyActiveUsers: TrendData[];
    userRetention: {
      day1: number;
      day7: number;
      day30: number;
    };
    sessionDuration: {
      average: number;
      trend: TrendData[];
    };
  }> {
    return apiClient.get(`/dashboard/user-engagement?timeRange=${timeRange}`);
  }

  /**
   * Get conversation insights
   */
  static async getConversationInsights(
    timeRange: "7d" | "30d" | "90d" = "30d"
  ): Promise<{
    totalConversations: number;
    averageLength: number;
    completionRate: number;
    satisfactionScore: number;
    topTopics: Array<{
      topic: string;
      count: number;
      percentage: number;
    }>;
    languageDistribution: Array<{
      language: string;
      count: number;
      percentage: number;
    }>;
    hourlyDistribution: Array<{
      hour: number;
      count: number;
    }>;
  }> {
    return apiClient.get(
      `/dashboard/conversation-insights?timeRange=${timeRange}`
    );
  }

  /**
   * Get error analytics
   */
  static async getErrorAnalytics(
    timeRange: "24h" | "7d" | "30d" = "7d"
  ): Promise<{
    totalErrors: number;
    errorRate: number;
    errorTrend: TrendData[];
    topErrors: Array<{
      error: string;
      count: number;
      percentage: number;
      lastSeen: string;
    }>;
    errorsByComponent: Array<{
      component: string;
      count: number;
      percentage: number;
    }>;
  }> {
    return apiClient.get(`/dashboard/error-analytics?timeRange=${timeRange}`);
  }

  /**
   * Export dashboard data
   */
  static async exportDashboardData(
    type: "analytics" | "activity" | "usage",
    format: "csv" | "json" | "pdf" = "csv",
    timeRange: "24h" | "7d" | "30d" | "90d" = "30d"
  ): Promise<Blob> {
    const response = await axios.get(
      `${APP_CONFIG.apiBaseUrl}/dashboard/export?type=${type}&format=${format}&timeRange=${timeRange}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${TokenManager.getToken()} public`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get system health check
   */
  static async getSystemHealth(): Promise<{
    status: "healthy" | "warning" | "critical";
    services: Array<{
      name: string;
      status: "up" | "down" | "degraded";
      responseTime: number;
      lastCheck: string;
    }>;
    resources: {
      cpu: number;
      memory: number;
      disk: number;
      network: number;
    };
    uptime: number;
  }> {
    return apiClient.get("/dashboard/health");
  }
}
