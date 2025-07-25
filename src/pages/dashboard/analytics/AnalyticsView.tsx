import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Activity,
  Clock,
  MessageSquare,
  Target,
} from "lucide-react";
import {
  useAnalytics,
  useDashboardOverview,
  usePerformanceMetrics,
  useUserEngagement,
  useConversationInsights,
} from "@/hooks/use-dashboard";

const analyticsItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "engagement", label: "User Engagement", icon: Users },
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "optimization", label: "Optimization", icon: Zap },
];

export function AnalyticsView() {
  const [activeItem, setActiveItem] = useState("overview");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  // Data hooks
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useAnalytics(timeRange);

  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
  } = useDashboardOverview(timeRange);

  const { data: performanceData, isLoading: performanceLoading } =
    usePerformanceMetrics(
      timeRange === "30d" || timeRange === "90d" ? "7d" : timeRange
    );

  const { data: engagementData, isLoading: engagementLoading } =
    useUserEngagement(timeRange === "24h" ? "7d" : timeRange);

  const { data: conversationData, isLoading: conversationLoading } =
    useConversationInsights(timeRange === "24h" ? "7d" : timeRange);

  const renderTimeRangeSelector = () => (
    <div className="mb-6">
      <Select
        value={timeRange}
        onValueChange={(value: typeof timeRange) => setTimeRange(value)}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">Last 24 hours</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderOverviewSection = () => {
    if (overviewLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      );
    }

    if (overviewError) {
      return (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>
            Failed to load overview data. Please try again.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData?.totalAgents || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {overviewData?.activeAgents || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData?.totalConversations || 0}
            </div>
            <p className="text-xs text-muted-foreground">Total conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData?.averageResponseTime || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewData?.successRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Task completion rate
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    const commonHeader = <div className="p-6">{renderTimeRangeSelector()}</div>;

    switch (activeItem) {
      case "overview":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Analytics Overview
            </h2>
            {renderOverviewSection()}

            {analyticsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : analyticsError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load analytics data.
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchAnalytics()}
                    className="ml-2">
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Key metrics over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Chart visualization will go here
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "performance":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Performance Metrics
            </h2>

            {performanceLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-64 md:col-span-2" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {performanceData?.averageResponseTime?.[0]?.value || 0}ms
                    </div>
                    <p className="text-muted-foreground">
                      Average response time
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Throughput</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {performanceData?.throughput?.[0]?.value || 0}
                    </div>
                    <p className="text-muted-foreground">Requests per minute</p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>System Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold">
                          {performanceData?.cpuUsage?.[0]?.value || 0}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          CPU Usage
                        </p>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {performanceData?.memoryUsage?.[0]?.value || 0}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Memory Usage
                        </p>
                      </div>
                      <div>
                        <div className="text-lg font-semibold">
                          {performanceData?.diskUsage || 0}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Disk Usage
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "engagement":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              User Engagement
            </h2>

            {engagementLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-48" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Session Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {engagementData?.sessionDuration?.average || 0}min
                      </div>
                      <p className="text-muted-foreground">
                        Average session time
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Day 1 Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {engagementData?.userRetention?.day1 || 0}%
                      </div>
                      <p className="text-muted-foreground">
                        Users returning after 1 day
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Day 30 Retention</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {engagementData?.userRetention?.day30 || 0}%
                      </div>
                      <p className="text-muted-foreground">
                        Users returning after 30 days
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        );

      case "conversations":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Conversation Insights
            </h2>

            {conversationLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-48" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Conversations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {conversationData?.totalConversations || 0}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Average Length</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {conversationData?.averageLength || 0}
                      </div>
                      <p className="text-muted-foreground">
                        messages per conversation
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {conversationData?.completionRate || 0}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Satisfaction Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {conversationData?.satisfactionScore || 0}/5
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        );

      case "optimization":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Optimization Recommendations
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Recommendations</CardTitle>
                  <CardDescription>
                    Suggestions to improve your agent performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>
                        Consider optimizing response time for better user
                        experience
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        Your conversation completion rate is excellent
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>User engagement metrics show positive trends</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
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
