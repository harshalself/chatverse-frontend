import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquare,
  Cpu,
  RefreshCw,
} from "lucide-react";
import {
  useModelUsage,
  useModelCosts,
  useTopPerformingAgents,
  useAgentOptimization,
  useAgentPerformance,
  useTimeframeOptions,
  useRefreshAnalytics,
  useUserEngagement,
  useUserBehavior,
} from "@/hooks/use-analytics";
import { Timeframe } from "@/types/analytics.types";
import { useAgent } from "@/contexts";
import { UsersSection } from "@/components/dashboard/analytics/UsersSection";
import { AgentsSection } from "@/components/dashboard/analytics/AgentsSection";
import { ModelsSection } from "@/components/dashboard/analytics/ModelsSection";

const analyticsItems = [
  { id: "users", label: "Users", icon: Users },
  { id: "agents", label: "Agents", icon: MessageSquare },
  { id: "models", label: "Models", icon: Cpu },
];

export function AnalyticsView() {
  const [activeItem, setActiveItem] = useState("users");
  const [timeRange, setTimeRange] = useState<Timeframe>("7d");

  // Get agent context for agent-specific analytics
  const { currentAgentId } = useAgent();

  // Get timeframe options
  const timeframeOptions = useTimeframeOptions();

  // Analytics data hooks
  const { data: modelUsageData, isLoading: modelUsageLoading, error: modelUsageError } =
    useModelUsage(timeRange);

  const { data: modelCostData, isLoading: modelCostLoading, error: modelCostError } =
    useModelCosts(timeRange);

  const { data: topAgentsData, isLoading: topAgentsLoading, error: topAgentsError } =
    useTopPerformingAgents(5, timeRange);

  const { data: optimizationData, error: optimizationError } = useAgentOptimization(
    currentAgentId || 0,
    !!currentAgentId
  );

  const { data: agentPerformanceData, isLoading: agentPerformanceLoading, error: agentPerformanceError } = useAgentPerformance(
    currentAgentId || 0,
    !!currentAgentId
  );

  const { data: userEngagementData, isLoading: engagementLoading, error: engagementError } =
    useUserEngagement();

  const { data: userBehaviorData, isLoading: conversationLoading, error: conversationError } =
    useUserBehavior(timeRange);

  // Refresh analytics mutation
  const { mutate: refreshAnalytics, isPending: isRefreshing } = useRefreshAnalytics();

  // Derived data for compatibility
  const analyticsLoading = modelUsageLoading;
  const analyticsError = null;
  const performanceData = null;
  const engagementData = userEngagementData?.data;
  const conversationData = userBehaviorData?.data;
  const optimizationDataExtracted = optimizationData?.data;

  const renderTimeRangeSelector = () => (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Time Range:</span>
        <Select value={timeRange} onValueChange={(value: Timeframe) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {timeframeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderContent = () => {
    const commonProps = {
      timeRange,
      renderTimeRangeSelector,
      performanceData,
      engagementData,
      engagementLoading,
      engagementError,
      conversationData,
      conversationLoading,
      conversationError,
      modelUsageData,
      modelUsageLoading,
      modelUsageError,
      modelCostData,
      modelCostLoading,
      modelCostError,
      topAgentsData,
      topAgentsLoading,
      topAgentsError,
      optimizationData: optimizationDataExtracted,
      optimizationError,
      agentPerformanceData: agentPerformanceData?.data,
      agentPerformanceLoading,
      agentPerformanceError,
      currentAgentId,
      analyticsLoading,
      analyticsError,
      refreshAnalytics,
      isRefreshing,
    };

    switch (activeItem) {
      case "users":
        return <UsersSection 
          engagementData={engagementData}
          engagementLoading={engagementLoading}
          conversationLoading={conversationLoading}
          engagementError={engagementError}
          conversationError={conversationError}
          onRefresh={refreshAnalytics}
          isRefreshing={isRefreshing}
        />;
      case "agents":
        return <AgentsSection 
          optimizationData={optimizationDataExtracted}
          agentPerformanceData={agentPerformanceData?.data}
          agentPerformanceLoading={agentPerformanceLoading}
          agentPerformanceError={agentPerformanceError}
          optimizationError={optimizationError}
          currentAgentId={currentAgentId}
          onRefresh={refreshAnalytics}
          isRefreshing={isRefreshing}
        />;
      case "models":
        return <ModelsSection 
          modelUsageData={modelUsageData}
          modelUsageLoading={modelUsageLoading}
          modelUsageError={modelUsageError}
          modelCostData={modelCostData}
          modelCostLoading={modelCostLoading}
          modelCostError={modelCostError}
          onRefresh={refreshAnalytics}
          isRefreshing={isRefreshing}
        />;
      default:
        return <UsersSection 
          engagementData={engagementData}
          engagementLoading={engagementLoading}
          conversationLoading={conversationLoading}
          engagementError={engagementError}
          conversationError={conversationError}
          onRefresh={refreshAnalytics}
          isRefreshing={isRefreshing}
        />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <ReusableSidebar
        title="Analytics"
        items={analyticsItems}
        activeItem={activeItem}
        onItemChange={setActiveItem}
      />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}