// Analytics Types and Interfaces for ChatVerse Frontend
// Based on backend analytics API documentation

import { ApiResponse } from './api.types';

// Common Types
export type Timeframe = '1d' | '7d' | '30d' | '90d';

// Agent Performance Analytics
export interface AgentPerformanceReport {
  agentId: number;
  agentName: string;
  totalChats: number;
  totalMessages: number;
  avgResponseTime: number;
  costAnalysis: {
    totalCost: number;
    avgCostPerChat: number;
    avgCostPerMessage: number;
    tokenUsage: number;
    modelDistribution: Array<{
      model: string;
      provider: string;
      usageCount: number;
      totalCost: number;
      avgResponseTime: number;
    }>;
  };
  qualityMetrics: {
    avgMessageLength: number;
    responseConsistency: number;
  };
}

export interface AgentComparison {
  agentId: number;
  agentName: string;
  totalMessages: number;
  avgResponseTime: number;
  totalCost: number;
  efficiencyScore: number;
}

export interface TopAgent {
  agentId: number;
  agentName: string;
  totalMessages: number;
  avgResponseTime: number;
  totalCost: number;
  efficiencyScore: number;
  rank: number;
}

export interface OptimizationRecommendations {
  currentPerformance: {
    score: number;
    responseTime: number;
    costEfficiency: number;
  };
  recommendedModel: string;
  potentialSavings: number;
  efficiencyGains: number;
  recommendations: string[];
}

// Model Usage Analytics
export interface ModelUsageStats {
  model: string;
  provider: string;
  usageCount: number;
  totalCost: number;
  avgResponseTime: number;
  avgSatisfaction: number;
}

export interface ModelUsageSummary {
  timeframe: string;
  totalModels: number;
  mostUsedModel: string;
  totalUsage: number;
  totalCost: number;
  modelStats: ModelUsageStats[];
}

export interface ModelCostBreakdown {
  model: string;
  provider: string;
  totalCost: number;
  totalTokens: number;
  avgCostPerToken: number;
  usageCount: number;
  percentage: number;
}

export interface CostTrend {
  date: string;
  totalCost: number;
  tokenCount: number;
  avgCostPerToken: number;
}

export interface ModelCostAnalysis {
  totalCost: number;
  totalTokens: number;
  modelBreakdown: ModelCostBreakdown[];
  costTrends: CostTrend[];
  optimization: {
    potentialSavings: number;
    recommendedModels: string[];
    actions: string[];
  };
}

export interface ModelPerformanceMetric {
  model: string;
  provider: string;
  avgResponseTime: number;
  costEfficiency: number;
  qualityScore: number;
  usageCount: number;
  totalCost: number;
}

export interface ModelPerformanceRanking {
  model: string;
  rank: number;
  speedScore: number;
  costScore: number;
  qualityScore: number;
  overallScore: number;
}

export interface ModelPerformanceComparison {
  timeframe: string;
  modelMetrics: ModelPerformanceMetric[];
  performanceComparison: ModelPerformanceRanking[];
  recommendations: {
    optimalModel: string;
    costSavingOpportunities: string[];
  };
}

// System Performance Analytics
export interface SystemPerformanceMetrics {
  timeframe: string;
  totalRequests: number;
  avgResponseTime: number;
  errorRate: number;
  uptime: number;
  throughput: {
    requestsPerSecond: number;
    peakRPS: number;
  };
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

// User Behavior Analytics (Phase 2)
export interface UserEngagementMetrics {
  userId: number;
  totalActivities: number;
  uniqueActiveDays: number;
  dailyActivityAverage: number;
  mostActiveHour: number;
  eventTypeBreakdown: {
    api_request: number;
    chat_message_send: number;
    chat_message_receive: number;
  };
  engagementScore: number;
}

export interface UserCohort {
  cohort: string;
  users: number;
  retention: {
    day1: number;
    day7: number;
    day30: number;
  };
}

export interface UserBehaviorInsights {
  timeframe: string;
  summary: {
    totalUsers: number;
    totalSessions: number;
    totalMessages: number;
    avgSessionDuration: number;
  };
  cohorts: UserCohort[];
  // insights: UserBehaviorInsight[]; // TODO: Define when endpoint is implemented
}

// API Response Types
export type AgentPerformanceResponse = ApiResponse<AgentPerformanceReport>;
export type AgentComparisonResponse = ApiResponse<AgentComparison[]>;
export type TopAgentsResponse = ApiResponse<TopAgent[]>;
export type OptimizationResponse = ApiResponse<OptimizationRecommendations>;

export type ModelUsageResponse = ApiResponse<ModelUsageSummary>;
export type ModelCostResponse = ApiResponse<ModelCostAnalysis>;
export type ModelPerformanceResponse = ApiResponse<ModelPerformanceComparison>;

export type SystemPerformanceResponse = ApiResponse<SystemPerformanceMetrics>;

export type UserEngagementResponse = ApiResponse<UserEngagementMetrics>;
export type UserBehaviorResponse = ApiResponse<UserBehaviorInsights>;

// Request Types for POST endpoints
export interface AgentComparisonRequest {
  agentIds: number[];
  timeframe: Timeframe;
}

// Aggregated Analytics Overview (for dashboard cards)
export interface AnalyticsOverview {
  totalAgents: number;
  totalConversations: number;
  avgResponseTime: number;
  totalCost: number;
  successRate: number;
  activeUsers: number;
  costEfficiency: number;
  topPerformingAgent: string;
}