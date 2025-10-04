import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle,
  Users,
  RefreshCw,
} from "lucide-react";
import { OptimizationRecommendations, AgentPerformanceReport } from "@/types/analytics.types";

interface AgentsSectionProps {
  optimizationData?: OptimizationRecommendations;
  agentPerformanceData?: AgentPerformanceReport;
  agentPerformanceLoading: boolean;
  agentPerformanceError?: Error;
  optimizationError?: Error;
  currentAgentId?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AgentsSection({
  optimizationData,
  agentPerformanceData,
  agentPerformanceLoading,
  agentPerformanceError,
  optimizationError,
  currentAgentId,
  onRefresh,
  isRefreshing,
}: AgentsSectionProps) {
  const hasError = optimizationError || agentPerformanceError;

  // Don't show loading skeleton during refresh - just show the refresh button spinning
  if (agentPerformanceLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Agent Analytics
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 sm:h-64 w-full" />
          <Skeleton className="h-24 sm:h-32 w-full" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Agent Analytics
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <Alert variant="destructive" className="mb-6 sm:mb-8">
          <AlertDescription>
            Failed to load agent analytics data. The analytics API may not be implemented yet on the backend.
            <br />
            <strong>Error:</strong> {optimizationError?.message || agentPerformanceError?.message || "API endpoint not found (404)"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Agent Analytics
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {agentPerformanceData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Agent Performance: {agentPerformanceData.agentName}
            </CardTitle>
            <CardDescription>
              Comprehensive performance metrics for this agent (all-time data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  {agentPerformanceData.totalChats}
                </div>
                <p className="text-sm text-muted-foreground">Total Chats</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  {agentPerformanceData.totalMessages}
                </div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  {agentPerformanceData.avgResponseTime.toFixed(1)}ms
                </div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold mb-1">
                  ${agentPerformanceData.costAnalysis.totalCost.toFixed(4)}
                </div>
                <p className="text-sm text-muted-foreground">Total Cost</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Cost Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cost per Chat:</span>
                    <span className="text-sm font-medium">${agentPerformanceData.costAnalysis.avgCostPerChat.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost per Message:</span>
                    <span className="text-sm font-medium">${agentPerformanceData.costAnalysis.avgCostPerMessage.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Token Usage:</span>
                    <span className="text-sm font-medium">{agentPerformanceData.costAnalysis.tokenUsage.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Quality Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Message Length:</span>
                    <span className="text-sm font-medium">{agentPerformanceData.qualityMetrics.avgMessageLength.toFixed(1)} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Response Consistency:</span>
                    <span className="text-sm font-medium">{agentPerformanceData.qualityMetrics.responseConsistency}%</span>
                  </div>
                </div>
              </div>
            </div>

            {agentPerformanceData.costAnalysis.modelDistribution.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Model Distribution</h4>
                <div className="space-y-2">
                  {agentPerformanceData.costAnalysis.modelDistribution.map((model, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{model.model}</p>
                        <p className="text-xs text-muted-foreground">{model.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{model.usageCount} uses</p>
                        <p className="text-xs text-muted-foreground">${model.totalCost.toFixed(4)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}