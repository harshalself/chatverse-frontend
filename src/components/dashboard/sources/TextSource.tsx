import { useState } from "react";
import { Plus, RefreshCw, FileText, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAgent } from "@/contexts";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTextSources,
  useCreateTextSource,
  useDeleteTextSource,
} from "@/hooks/use-text-sources";

export function TextSource() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  // Get the current agent ID from context
  const { currentAgentId, isAgentSelected } = useAgent();

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Text sources hooks
  const {
    data: textSources,
    isLoading: textSourcesLoading,
    error: textSourcesError,
    refetch: refetchTextSources,
  } = useTextSources(currentAgentId || 0, isAgentSelected);

  const { mutate: createTextSource, isPending: createLoading } =
    useCreateTextSource();

  const { mutate: deleteTextSource } = useDeleteTextSource();

  const handleAddText = () => {
    // Check if agent is selected
    if (!currentAgentId) {
      toast({
        title: "No agent selected",
        description: "Please select an agent before creating text sources.",
        variant: "destructive",
      });
      return;
    }

    if (title && content) {
      createTextSource(
        {
          agent_id: currentAgentId,
          name: title,
          description: description || undefined,
          content,
        },
        {
          onSuccess: () => {
            // Clear form
            setTitle("");
            setContent("");
            setDescription("");
            refetchTextSources();
            // Invalidate sources summary query to refresh SourcesSummary
            queryClient.invalidateQueries({
              queryKey: ["sources", "by-agent", currentAgentId],
            });
          },
        }
      );
    }
  };

  const handleDeleteText = (id: number, name: string) => {
    deleteTextSource(id, {
      onSuccess: () => {
        toast({
          title: "Text source deleted",
          description: `"${name}" has been removed from your knowledge base.`,
        });
        refetchTextSources();
      },
    });
  };

  // Show date and time for all dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Text Source
          </h2>
          <p className="text-muted-foreground">
            Add custom text content to your knowledge base
          </p>
        </div>
      </div>

      {/* Show alert if agent is not selected */}
      {!isAgentSelected && (
        <Alert className="mb-6">
          <AlertDescription>
            Please select an agent to manage text sources.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Text Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your text content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your text content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text content here..."
              className="min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleAddText}
            disabled={!title || !content || createLoading || !isAgentSelected}
            title={!isAgentSelected ? "Select an agent first" : ""}>
            {createLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {createLoading ? "Adding..." : "Add Text Source"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Text Sources */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Existing Text Sources</h3>

        {textSourcesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : textSourcesError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load text sources.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchTextSources()}
                className="ml-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : textSources && textSources.length > 0 ? (
          <div className="space-y-4">
            {textSources.map((source) => (
              <Card key={source.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {source.name}
                        </h4>
                        {source.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {source.description}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {source.content?.substring(0, 150) ||
                            "No preview available"}
                          {(source.content?.length || 0) > 150 && "..."}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                          <span>Updated {formatDate(source.updated_at)}</span>
                          <span>•</span>
                          <span>{source.content?.length || 0} characters</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          source.status === "completed"
                            ? "default"
                            : source.status === "processing"
                            ? "secondary"
                            : source.status === "failed"
                            ? "destructive"
                            : "outline"
                        }>
                        {source.status === "completed"
                          ? "Ready"
                          : source.status === "processing"
                          ? "Processing"
                          : source.status === "failed"
                          ? "Failed"
                          : "Pending"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Opening text source",
                            description: `Opening "${source.name}"...`,
                          });
                          // TODO: Implement text viewer modal
                        }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteText(source.id, source.name)
                        }>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">No text sources yet</h4>
              <p className="text-muted-foreground mb-4">
                {!isAgentSelected
                  ? "Select an agent first to view its text sources"
                  : "Create your first text source using the form above"}
              </p>
              <Button
                onClick={() => document.getElementById("title")?.focus()}
                disabled={!isAgentSelected}
                title={!isAgentSelected ? "Select an agent first" : ""}>
                <Plus className="h-4 w-4 mr-2" />
                Create Text Source
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
