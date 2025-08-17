import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Trash2, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  useChatSessions,
  useDeleteSession,
  useCreateSession,
} from "@/hooks/use-chat";
import type { ChatSession } from "@/types/chat.types";

interface SessionSidebarProps {
  currentSessionId: number | null;
  onSessionSelect: (sessionId: number) => void;
  onNewSession: () => void;
  agentId?: number;
}

export function SessionSidebar({
  currentSessionId,
  onSessionSelect,
  onNewSession,
  agentId,
}: SessionSidebarProps) {
  const [deletingSessionId, setDeletingSessionId] = useState<number | null>(
    null
  );
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(
    null
  );

  const navigate = useNavigate();
  const { agentId: urlAgentId } = useParams();

  const { data: sessions = [], isLoading, refetch } = useChatSessions(agentId);

  const { mutate: deleteSession } = useDeleteSession();
  const { mutate: createSession, isPending: isCreatingSession } =
    useCreateSession();

  const handleCreateSession = () => {
    if (!agentId || !urlAgentId) {
      // Fallback to old method if no agent selected
      onNewSession();
      return;
    }

    createSession(agentId, {
      onSuccess: (response) => {
        // Now that the apiClient returns response.data directly,
        // the response should have the correct structure
        const newSessionId = response.data.id;

        // Navigate to the newly created session
        navigate(
          ROUTES.AGENT_SESSION_WITH_IDS(urlAgentId, newSessionId.toString())
        );
        refetch();
      },
    });
  };

  const handleDeleteSession = async (sessionId: number) => {
    setDeletingSessionId(sessionId);

    deleteSession(sessionId, {
      onSuccess: () => {
        // If deleting current session, start new session
        if (currentSessionId === sessionId) {
          onNewSession();
        }
        refetch();
        setSessionToDelete(null);
      },
      onSettled: () => {
        setDeletingSessionId(null);
      },
    });
  };

  const handleDeleteClick = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessionToDelete(session);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      handleDeleteSession(sessionToDelete.id);
    }
  };

  const formatSessionDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return format(date, "h:mm a");
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        return format(date, "MMM d");
      }
    } catch (error) {
      return "Unknown";
    }
  };

  const truncateMessage = (message: string, maxLength = 40) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-64 border-r border-border bg-background/50 backdrop-blur-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-6 flex items-center rounded-full justify-center bg-primary/10">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">
              Chat Sessions
            </h2>
          </div>
          <Button
            onClick={handleCreateSession}
            size="sm"
            className="gap-1.5 h-7 px-2.5 text-xs"
            disabled={isCreatingSession}>
            <Plus className="h-3.5 w-3.5" />
            {isCreatingSession ? "Creating..." : "New"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center">
            <div className="size-12 flex items-center rounded-full justify-center bg-muted/50 mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">
              No conversations yet
            </p>
            <p className="text-xs text-muted-foreground">
              Start a new chat to begin
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto h-full">
            <div className="p-2 space-y-1">
              {sessions.map((session: ChatSession) => (
                <div
                  key={session.id}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer hover:bg-muted/60 transition-all duration-200",
                    currentSessionId === session.id &&
                      "bg-primary/5 border border-primary/20 shadow-sm"
                  )}
                  onClick={() => onSessionSelect(session.id)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs font-mono px-1.5 py-0.5">
                          #{session.id}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5">
                          {session.message_count}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatSessionDate(session.last_message_time)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-medium leading-snug overflow-hidden">
                        {truncateMessage(session.last_message, 60)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                      onClick={(e) => handleDeleteClick(session, e)}
                      disabled={deletingSessionId === session.id}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!sessionToDelete}
        onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete session #{sessionToDelete?.id}?
              <br />
              <span className="text-sm text-muted-foreground mt-1 block">
                "{sessionToDelete?.last_message}"
              </span>
              <br />
              This action cannot be undone and will permanently delete all
              messages in this session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingSessionId === sessionToDelete?.id}>
              {deletingSessionId === sessionToDelete?.id
                ? "Deleting..."
                : "Delete Session"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
