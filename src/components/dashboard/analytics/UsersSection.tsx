import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Users,
  Clock,
  TrendingUp,
  MessageSquare,
  Calendar,
  Target,
  RefreshCw,
} from "lucide-react";
import { UserEngagementMetrics } from "@/types/analytics.types";

interface UsersSectionProps {
  engagementData?: UserEngagementMetrics;
  engagementLoading: boolean;
  conversationLoading: boolean;
  engagementError?: Error;
  conversationError?: Error;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function UsersSection({
  engagementData,
  engagementLoading,
  conversationLoading,
  engagementError,
  conversationError,
  onRefresh,
  isRefreshing,
}: UsersSectionProps) {
  const isLoading = engagementLoading || conversationLoading;
  // Only show error if engagement fails - conversation and activity data are optional
  const hasError = engagementError;

  // Don't show loading skeleton during refresh - just show the refresh button spinning
  if (isLoading && !isRefreshing) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            User Analytics
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
            User Analytics
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
            Failed to load user engagement data.
            <br />
            <strong>Error:</strong> {engagementError?.message || "API endpoint not found (404)"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          User Analytics
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
              Total Activities
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {engagementData?.totalActivities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Total user activities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Active Days
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {engagementData?.uniqueActiveDays || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Days with activity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Daily Average
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {engagementData?.dailyActivityAverage || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Activities per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Engagement Score
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {engagementData?.engagementScore || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              User engagement level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              API Requests
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {engagementData?.eventTypeBreakdown?.api_request || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              API calls made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Chat Messages
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {(engagementData?.eventTypeBreakdown?.chat_message_send || 0) + (engagementData?.eventTypeBreakdown?.chat_message_receive || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sent: {engagementData?.eventTypeBreakdown?.chat_message_send || 0}, Received: {engagementData?.eventTypeBreakdown?.chat_message_receive || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Most Active Hour
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {engagementData?.mostActiveHour || 0}:00
            </div>
            <p className="text-xs text-muted-foreground">
              Peak activity time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Analysis Period
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              All Time
            </div>
            <p className="text-xs text-muted-foreground">
              Complete user history
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Activity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">API Requests</span>
                </div>
                <span className="text-sm font-bold">{engagementData?.eventTypeBreakdown?.api_request || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Messages Sent</span>
                </div>
                <span className="text-sm font-bold">{engagementData?.eventTypeBreakdown?.chat_message_send || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Messages Received</span>
                </div>
                <span className="text-sm font-bold">{engagementData?.eventTypeBreakdown?.chat_message_receive || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              User Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`p-1 rounded-full ${
                    (engagementData?.engagementScore || 0) >= 80 ? 'bg-green-100' :
                    (engagementData?.engagementScore || 0) >= 60 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    <Target className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {(engagementData?.engagementScore || 0) >= 80 ? 'Highly Engaged' :
                       (engagementData?.engagementScore || 0) >= 60 ? 'Moderately Engaged' : 'Low Engagement'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Engagement score: {engagementData?.engagementScore || 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-blue-100">
                    <Clock className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Peak Activity</p>
                    <p className="text-xs text-muted-foreground">
                      Most active at {engagementData?.mostActiveHour || 0}:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-full bg-purple-100">
                    <Calendar className="h-3 w-3 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Analysis Period</p>
                    <p className="text-xs text-muted-foreground">
                      All time data
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
