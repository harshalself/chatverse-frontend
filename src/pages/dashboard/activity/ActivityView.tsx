import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import {
  MessageSquare,
  Clock,
  BarChart3,
  Filter,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useActivityLogs,
  useConversationInsights,
  usePerformanceMetrics,
  useActivityFeed,
  useSystemHealth,
} from "@/hooks/use-dashboard";

const activityItems = [
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "logs", label: "Activity Logs", icon: Clock },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "filters", label: "Filters", icon: Filter },
];

export function ActivityView() {
  const [activeItem, setActiveItem] = useState("conversations");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");

  // Activity data hooks
  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useActivityLogs();

  const { data: conversationData, isLoading: conversationLoading } =
    useConversationInsights(timeRange === "24h" ? "7d" : timeRange);

  const { data: performanceData, isLoading: performanceLoading } =
    usePerformanceMetrics(
      timeRange === "30d" ? "7d" : timeRange === "7d" ? "7d" : "24h"
    );

  const { data: activityFeed, isLoading: feedLoading } = useActivityFeed(50);

  const { data: systemHealth, isLoading: healthLoading } = useSystemHealth();

  const renderTimeRangeSelector = () => (
    <div className="flex items-center space-x-2 mb-6">
      <span className="text-sm font-medium">Time Range:</span>
      {["24h", "7d", "30d"].map((range) => (
        <Button
          key={range}
          variant={timeRange === range ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange(range as "24h" | "7d" | "30d")}>
          {range}
        </Button>
      ))}
    </div>
  );

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "conversations":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Conversations
            </h2>

            {conversationLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-48" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <p className="text-muted-foreground text-sm">messages</p>
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
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Conversations</CardTitle>
                    <CardDescription>
                      Latest conversation activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      {conversationData?.topTopics?.map(
                        (topic: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">
                                {topic.topic || `Topic ${index + 1}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {topic.count || 0} conversations
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline">
                                {topic.percentage || 0}%
                              </Badge>
                            </div>
                          </div>
                        )
                      ) || (
                        <p className="text-muted-foreground">
                          No conversation topics found
                        </p>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "logs":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Activity Logs
            </h2>

            {activityLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : activityError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load activity logs.
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchActivity()}
                    className="ml-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>System Activity</CardTitle>
                  <CardDescription>
                    Real-time activity and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    {activityData?.data?.map((log: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 py-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(
                            log.type || "info"
                          )}`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {log.message || `Activity ${index + 1}`}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(
                                log.timestamp || new Date().toISOString()
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {log.agentId || "System"} • {log.type || "info"}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-muted-foreground">
                        No activity logs found
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "performance":
        return (
          <div className="p-6">
            {renderTimeRangeSelector()}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Performance
            </h2>

            {performanceLoading || healthLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {performanceData?.averageResponseTime?.[0]?.value || 0}
                        ms
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Average response
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
                      <p className="text-muted-foreground text-sm">
                        Requests/min
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            systemHealth?.status === "healthy"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}></div>
                        <span className="font-medium">
                          {systemHealth?.status || "Unknown"}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Overall system status
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>CPU Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {performanceData?.cpuUsage?.[0]?.value || 0}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Memory Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {performanceData?.memoryUsage?.[0]?.value || 0}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Active Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {systemHealth?.services?.length || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        );

      case "filters":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Activity Filters
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Activity Feed</CardTitle>
                  <CardDescription>
                    Live stream of system activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feedLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-12" />
                      ))}
                    </div>
                  ) : (
                    <ScrollArea className="h-96">
                      {activityFeed?.data?.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 py-2">
                          <div
                            className={`w-2 h-2 rounded-full ${getStatusColor(
                              item.type || "info"
                            )}`}></div>
                          <div className="flex-1">
                            <p className="text-sm">
                              {item.message || `Activity ${index + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(
                                item.timestamp || new Date().toISOString()
                              )}
                            </p>
                          </div>
                        </div>
                      )) || (
                        <p className="text-muted-foreground">
                          No recent activity
                        </p>
                      )}
                    </ScrollArea>
                  )}
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
        title="Activity"
        items={activityItems}
        activeItem={activeItem}
        onItemChange={setActiveItem}
      />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}
