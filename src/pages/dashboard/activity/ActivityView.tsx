import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import {
  MessageSquare,
  Clock,
} from "lucide-react";
import { ReadOnlyChat } from "@/components/dashboard/activity/ReadOnlyChat";
import { SessionsList } from "@/components/dashboard/activity/SessionsList";
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
import { RefreshCw } from "lucide-react";
import {
  useActivityLogs,
  useConversationInsights,
  usePerformanceMetrics,
  useActivityFeed,
  useSystemHealth,
} from "@/hooks/use-dashboard";
import { useAgent } from "@/contexts/AgentContext";
import { useAgent as useAgentDetails } from "@/hooks/use-agents";

const activityItems = [
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "activity", label: "Activity", icon: Clock },
];

export function ActivityView() {
  const [activeItem, setActiveItem] = useState("conversations");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");

  // Get current agent from context
  const { currentAgentId, isAgentSelected } = useAgent();

  // Get agent details
  const { data: agentDetails } = useAgentDetails(
    currentAgentId?.toString() || "",
    isAgentSelected
  );

  // Activity data hooks - only for conversations tab
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

  const handleSessionSelect = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  const renderTimeRangeSelector = () => (
    <div className="flex items-center space-x-2 mb-4">
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
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const renderConversationsContent = () => (
    <div className="space-y-6">
      {renderTimeRangeSelector()}
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Conversation Insights
      </h2>

      {conversationLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversationData?.totalConversations || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Completion rate: {conversationData?.completionRate || 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Message Length
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversationData?.averageLength || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                characters per message
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Satisfaction Score
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {conversationData?.satisfactionScore || 0}/5
              </div>
              <p className="text-xs text-muted-foreground">
                average rating
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Logs Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Recent Activity
        </h3>
        
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
                ))}
                {(!activityData?.data || activityData.data.length === 0) && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Activity Yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Activity logs will appear here as you use the system.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderActivityContent = () => (
    <div className="flex h-full">
      <SessionsList
        selectedSessionId={selectedSessionId}
        onSessionSelect={handleSessionSelect}
      />
      <ReadOnlyChat
        sessionId={selectedSessionId}
        agentId={currentAgentId || undefined}
        agentName={agentDetails?.name || "AI Assistant"}
      />
    </div>
  );

  const renderContent = () => {
    switch (activeItem) {
      case "conversations":
        return renderConversationsContent();
      case "activity":
        return renderActivityContent();
      default:
        return renderConversationsContent();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <ReusableSidebar
        title="Activity"
        items={activityItems}
        activeItem={activeItem}
        onItemChange={setActiveItem}
      />
      <main className="flex-1 overflow-hidden">
        {activeItem === "activity" ? (
          renderContent()
        ) : (
          <div className="p-6 h-full overflow-y-auto">
            {renderContent()}
          </div>
        )}
      </main>
    </div>
  );
}