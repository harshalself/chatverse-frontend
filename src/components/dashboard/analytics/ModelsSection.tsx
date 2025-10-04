import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Cpu,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { ModelUsageSummary, ModelCostAnalysis, ModelPerformanceComparison } from "@/types/analytics.types";

interface ModelsSectionProps {
  modelUsageData?: { data?: ModelUsageSummary };
  modelUsageLoading: boolean;
  modelUsageError?: Error;
  modelCostData?: { data?: ModelCostAnalysis };
  modelCostLoading: boolean;
  modelCostError?: Error;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ModelsSection({
  modelUsageData,
  modelUsageLoading,
  modelUsageError,
  modelCostData,
  modelCostLoading,
  modelCostError,
  onRefresh,
  isRefreshing,
}: ModelsSectionProps) {
  // Don't show loading skeleton during refresh - just show the refresh button spinning
  if (modelUsageLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Model Analytics
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

  if (modelUsageError) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Model Analytics
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
            Failed to load model analytics data. The analytics API may not be implemented yet on the backend.
            <br />
            <strong>Error:</strong> {modelUsageError?.message || "API endpoint not found (404)"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const usageData = modelUsageData?.data;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Model Analytics
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Models
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {usageData?.totalModels || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Most Used Model
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-base font-bold truncate">
              {usageData?.mostUsedModel || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Primary model
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Usage
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {usageData?.totalUsage || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Cost
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ${usageData?.totalCost || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis Small Cards */}
      {modelCostData?.data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ${modelCostData.data.totalCost?.toFixed(6) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Total spending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Total Tokens
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {modelCostData.data.totalTokens?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Tokens used
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Potential Savings
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                ${modelCostData.data.optimization?.potentialSavings?.toFixed(6) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Cost reduction opportunity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">
                Cost Trends
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {modelCostData.data.costTrends?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Data points
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Big Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Model Usage Breakdown
            </CardTitle>
            <CardDescription>
              Usage statistics for each model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageData?.modelStats?.slice(0, 5).map((model, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{model.model.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium">{model.model}</p>
                      <p className="text-sm text-muted-foreground">
                        {model.provider}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {model.usageCount} uses
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${model.totalCost}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground">No model usage data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Model Performance
            </CardTitle>
            <CardDescription>
              Performance metrics and efficiency scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageData?.modelStats?.slice(0, 4).map((model, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{model.model}</h4>
                    <Badge variant="outline" className="text-xs">
                      {model.provider}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{model.avgResponseTime}ms</p>
                      <p className="text-xs text-muted-foreground">Response Time</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{model.avgSatisfaction}/5</p>
                      <p className="text-xs text-muted-foreground">Satisfaction</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${model.totalCost}</p>
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                    </div>
                  </div>
                </div>
              )) || (
                <p className="text-muted-foreground">No model performance data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis Big Cards */}
      {modelCostData?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Breakdown by Model
              </CardTitle>
              <CardDescription>
                Detailed cost analysis for each model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelCostData.data.modelBreakdown?.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{model.model.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{model.model}</p>
                        <p className="text-sm text-muted-foreground">
                          {model.provider}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${model.totalCost.toFixed(6)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {model.percentage.toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground">No cost breakdown data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Cost Optimization
              </CardTitle>
              <CardDescription>
                Recommendations to reduce costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelCostData.data.optimization?.actions?.map((action, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-blue-100 mt-0.5">
                        <Target className="h-3 w-3 text-blue-600" />
                      </div>
                      <p className="text-sm">{action}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-muted-foreground">No optimization recommendations available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}