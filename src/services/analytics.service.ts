import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  Timeframe,
  AgentPerformanceResponse,
  AgentComparisonResponse,
  AgentComparisonRequest,
  TopAgentsResponse,
  OptimizationResponse,
  ModelUsageResponse,
  ModelCostResponse,
  ModelPerformanceResponse,
  SystemPerformanceResponse,
  UserEngagementResponse,
  UserBehaviorResponse,
  AnalyticsOverview,
} from "@/types/analytics.types";

export class AnalyticsService {
  // ===============================
  // Agent Performance Analytics
  // ===============================

  /**
   * Get performance metrics for a specific agent
   */
  static async getAgentPerformance(
    agentId: number
  ): Promise<AgentPerformanceResponse> {
    const url = API_ENDPOINTS.ANALYTICS.AGENTS.PERFORMANCE(agentId);
    return apiClient.get(url);
  }

  /**
   * Compare performance metrics between multiple agents
   */
  static async compareAgents(
    data: AgentComparisonRequest
  ): Promise<AgentComparisonResponse> {
    return apiClient.post(API_ENDPOINTS.ANALYTICS.AGENTS.COMPARE, data);
  }

  /**
   * Get top performing agents ranking
   */
  static async getTopPerformingAgents(
    limit: number = 10,
    timeframe: Timeframe = "7d"
  ): Promise<TopAgentsResponse> {
    const url = `${API_ENDPOINTS.ANALYTICS.AGENTS.TOP}?limit=${limit}&timeframe=${timeframe}`;
    return apiClient.get(url);
  }

  /**
   * Get optimization recommendations for an agent
   */
  static async getAgentOptimization(
    agentId: number
  ): Promise<OptimizationResponse> {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.AGENTS.OPTIMIZE(agentId));
  }

  // ===============================
  // Model Usage Analytics
  // ===============================

  /**
   * Get model usage statistics
   */
  static async getModelUsage(
    timeframe: Timeframe = "7d"
  ): Promise<ModelUsageResponse> {
    const url = `${API_ENDPOINTS.ANALYTICS.MODELS.USAGE}?timeframe=${timeframe}`;
    return apiClient.get(url);
  }

  /**
   * Get detailed cost analysis for all models
   */
  static async getModelCosts(
    timeframe: Timeframe = "30d"
  ): Promise<ModelCostResponse> {
    const url = `${API_ENDPOINTS.ANALYTICS.MODELS.COSTS}?timeframe=${timeframe}`;
    return apiClient.get(url);
  }

  /**
   * Get model performance comparison
   */
  static async getModelPerformance(
    timeframe: Timeframe = "7d"
  ): Promise<ModelPerformanceResponse> {
    const url = `${API_ENDPOINTS.ANALYTICS.MODELS.PERFORMANCE}?timeframe=${timeframe}`;
    return apiClient.get(url);
  }

  // ===============================
  // System Performance Analytics
  // ===============================

  /**
   * Get overall system performance metrics
   */
  static async getSystemPerformance(
    timeframe: Timeframe = "7d"
  ): Promise<SystemPerformanceResponse> {
    const url = `${API_ENDPOINTS.ANALYTICS.SYSTEM.PERFORMANCE}?timeframe=${timeframe}`;
    return apiClient.get(url);
  }

  // ===============================
  // User Behavior Analytics (Phase 2)
  // ===============================

  /**
   * Get user engagement metrics
   */
  static async getUserEngagement(): Promise<UserEngagementResponse> {
    const url = API_ENDPOINTS.ANALYTICS.USER.ENGAGEMENT;
    console.log('📊 Analytics Service - User Engagement:', {
      endpoint: API_ENDPOINTS.ANALYTICS.USER.ENGAGEMENT,
      fullUrl: url
    });
    return apiClient.get(url);
  }

  /**
   * Get user behavior insights with cohort analysis
   */
  static async getUserBehavior(
    timeframe: Timeframe = "30d",
    limit: number = 10
  ): Promise<UserBehaviorResponse> {
    const url = `${API_ENDPOINTS.ANALYTICS.USER.BEHAVIOR}?timeframe=${timeframe}&limit=${limit}`;
    return apiClient.get(url);
  }

  // ===============================
  // Aggregated Analytics (Overview)
  // ===============================

  /**
   * Get aggregated analytics overview for dashboard cards
   * This combines data from multiple endpoints to create overview metrics
   */
  static async getAnalyticsOverview(
    timeframe: Timeframe = "7d"
  ): Promise<AnalyticsOverview> {
    try {
      // Fetch data from multiple endpoints in parallel
      const [
        systemPerformance,
        modelUsage,
        topAgents,
        userEngagement,
      ] = await Promise.all([
        this.getSystemPerformance(timeframe),
        this.getModelUsage(timeframe),
        this.getTopPerformingAgents(1, timeframe),
        this.getUserEngagement().catch(() => null), // Phase 2 - may not be available yet
      ]);

      // Combine data into overview format
      const overview: AnalyticsOverview = {
        totalAgents: modelUsage.data.totalModels || 0,
        totalConversations: systemPerformance.data.totalRequests || 0,
        avgResponseTime: systemPerformance.data.avgResponseTime || 0,
        totalCost: modelUsage.data.totalCost || 0,
        successRate: ((1 - systemPerformance.data.errorRate) * 100) || 0,
        activeUsers: userEngagement?.data.activeUsers || 0,
        costEfficiency: modelUsage.data.totalCost > 0 
          ? (systemPerformance.data.totalRequests / modelUsage.data.totalCost) 
          : 0,
        topPerformingAgent: topAgents.data[0]?.agentName || "N/A",
      };

      return overview;
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      throw error;
    }
  }

  // ===============================
  // Utility Methods
  // ===============================

  /**
   * Convert timeframe from analytics format to backend format
   */
  private static mapTimeframe(timeframe: Timeframe): string {
    const mapping = {
      "1d": "1d",
      "7d": "7d", 
      "30d": "30d",
      "90d": "90d"
    };
    return mapping[timeframe] || "7d";
  }

  /**
   * Get available timeframes for UI selectors
   */
  static getAvailableTimeframes(): { value: Timeframe; label: string }[] {
    return [
      { value: "1d", label: "Last 24 hours" },
      { value: "7d", label: "Last 7 days" },
      { value: "30d", label: "Last 30 days" },
      { value: "90d", label: "Last 90 days" },
    ];
  }
}