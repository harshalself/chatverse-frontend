import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, MessageSquare, Database } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { useChatSessions } from "@/hooks/use-chat";
import { useTotalSources } from "@/hooks/use-total-sources";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function UsageView() {
  // Get agents data - use the main agents list API
  const {
    data: agentsData,
    isLoading: agentsLoading,
    error: agentsError,
  } = useAgents();

  // Get chat sessions (all sessions across agents)
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useChatSessions();

  // Get total sources across all agents
  const {
    data: totalSourcesCount,
    isLoading: sourcesLoading,
    error: sourcesError,
  } = useTotalSources();

  // Calculate metrics with robust fallback pattern (same as AgentsView)
  const agents = Array.isArray(agentsData)
    ? agentsData
    : Array.isArray(agentsData?.data)
    ? agentsData.data
    : Array.isArray(agentsData?.agents)
    ? agentsData.agents
    : [];

  const totalAgents = agents.length;
  const totalSessions = sessionsData?.length || 0;
  const totalSources = totalSourcesCount || 0;
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Usage Analytics
        </h1>
        <p className="text-muted-foreground">
          Monitor your workspace usage and performance metrics.
        </p>
      </div>

      {/* Usage Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Agents Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {agentsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : agentsError ? (
              <Alert variant="destructive">
                <AlertDescription>Failed to load agents data</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {totalAgents}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active AI agents in your workspace
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sessions Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : sessionsError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load sessions data
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {totalSessions}
                </div>
                <p className="text-xs text-muted-foreground">
                  Chat sessions created
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sources Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Database className="h-4 w-4" />
              Total Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sourcesLoading ? (
              <Skeleton className="h-8 w-16 mb-1" />
            ) : sourcesError ? (
              <Alert variant="destructive">
                <AlertDescription>Failed to load sources data</AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="text-2xl font-bold text-foreground">
                  {totalSources}
                </div>
                <p className="text-xs text-muted-foreground">
                  Data sources across all agents
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
