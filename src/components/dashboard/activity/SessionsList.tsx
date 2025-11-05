import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquare, Clock, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChatSessions, useDeleteSession } from "@/hooks/use-chat";
import { useAgent } from "@/contexts/AgentContext";
import { useAgent as useAgentDetails } from "@/hooks/use-agents";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ChatSession } from "@/types/chat.types";

interface SessionsListProps {
  selectedSessionId?: number | null;
  onSessionSelect: (sessionId: number) => void;
}

export function SessionsList({
  selectedSessionId,
  onSessionSelect,
}: SessionsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get current agent from context
  const { currentAgentId, isAgentSelected } = useAgent();

  // Get agent details for display
  const { data: agentDetails } = useAgentDetails(
    currentAgentId?.toString() || "",
    isAgentSelected
  );

  // Fetch chat sessions for the current agent
  const {
    data: sessionsData,
    isLoading,
    error,
    refetch,
  } = useChatSessions(currentAgentId || 0, isAgentSelected);

  // Mutations for deleting sessions
  const deleteSessionMutation = useDeleteSession();

  // Extract sessions from the response
  const sessions: ChatSession[] = sessionsData || [];

  // Filter sessions based on search
  const filteredSessions = sessions.filter((session) => {
    const sessionTitle = `Session ${session.id}`;
    const matchesSearch =
      sessionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (session.last_message || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleDeleteSession = (sessionId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent session selection

    deleteSessionMutation.mutate(sessionId, {
      onSuccess: () => {
        if (selectedSessionId === sessionId) {
          onSessionSelect(0); // Deselect if current session was deleted
        }
        toast({
          title: "Success",
          description: "Session deleted",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to delete session",
          variant: "destructive",
        });
      },
    });
  };

  const formatLastMessage = (message: string, maxLength = 50) => {
    if (!message) return "No messages yet";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  if (!isAgentSelected || !currentAgentId) {
    return (
      <div className="w-80 border-r border-border bg-background/50 p-4">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Agent Selected
            </h3>
            <p className="text-sm text-muted-foreground">
              Please select an agent to view chat sessions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-background/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-foreground">
            Chat Sessions
          </h2>
        </div>

        {/* Agent Info */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg">
          <div className="size-8 flex items-center rounded-full justify-center bg-primary/10">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {agentDetails?.name || "Agent"}
            </p>
            <p className="text-xs text-muted-foreground">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load chat sessions.
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="ml-2">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? "No matching sessions" : "No sessions yet"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search"
                : "Previous chat sessions will appear here"}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedSessionId === session.id
                      ? "bg-primary/5 border-primary/20"
                      : "border-transparent"
                  }`}
                  onClick={() => onSessionSelect(session.id)}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground truncate flex-1">
                        Session {session.id}
                      </h4>
                      <Badge variant="secondary" className="text-xs ml-2">
                        active
                      </Badge>
                    </div>

                    {session.last_message && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {formatLastMessage(session.last_message)}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatDistanceToNow(
                            new Date(
                              session.last_message_time || session.created_at
                            ),
                            {
                              addSuffix: true,
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        <span>{session.message_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
