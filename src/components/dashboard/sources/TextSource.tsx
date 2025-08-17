import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useCreateTextSource,
  useDeleteTextSource,
} from "@/hooks/use-text-sources";
import { useSourcesByAgent } from "@/hooks/use-base-sources";
import { TextSource as TextSourceType } from "@/types/source.types";

export function TextSource() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  // Selection state for text sources
  const [selectedTexts, setSelectedTexts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  // Modal viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerSources, setViewerSources] = useState<any[]>([]);
  // Select all logic
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTexts([]);
    } else {
      setSelectedTexts((textSources || []).map((src) => src.id));
    }
    setSelectAll(!selectAll);
  };

  // Select individual text source
  const handleSelectText = (textId: number) => {
    setSelectedTexts((prev) =>
      prev.includes(textId)
        ? prev.filter((id) => id !== textId)
        : [...prev, textId]
    );
  };
  const { toast } = useToast();

  // Get the current agent ID from context
  const { currentAgentId, isAgentSelected } = useAgent();

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Use the same sources as AllSourcesTable, then filter for text type
  const {
    data: allSources,
    isLoading: textSourcesLoading,
    error: textSourcesError,
    refetch: refetchTextSources,
  } = useSourcesByAgent(currentAgentId || 0, isAgentSelected);

  // Only show sources of type 'text' (text sources)
  const textSources = (allSources || []).filter((src) => src.type === "text");

  // Debug logs
  console.log("[TextSource] currentAgentId:", currentAgentId);
  console.log("[TextSource] isAgentSelected:", isAgentSelected);
  console.log("[TextSource] allSources:", allSources);
  console.log("[TextSource] textSources:", textSources);

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
    <div className="flex-1 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Text Sources
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload and manage your knowledge base text content
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
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text content here..."
              className="min-h-[150px] sm:min-h-[200px] w-full"
            />
          </div>
          <Button
            onClick={handleAddText}
            disabled={!title || !content || createLoading || !isAgentSelected}
            title={!isAgentSelected ? "Select an agent first" : ""}
            className="w-full sm:w-auto">
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
        {textSourcesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
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
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="accent-primary h-4 w-4 rounded border"
                />
                <span className="text-sm font-medium">
                  Select All Text Sources
                </span>
              </div>
              {selectedTexts.length > 0 && (
                <div className="flex items-center space-x-2 sm:ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const selected = textSources.filter((src) =>
                        selectedTexts.includes(src.id)
                      );
                      setViewerSources(selected);
                      setViewerOpen(true);
                    }}
                    className="text-xs sm:text-sm">
                    <Eye className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">View </span>(
                    {selectedTexts.length})
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      selectedTexts.forEach((id) => handleDeleteText(id, ""));
                      setSelectedTexts([]);
                    }}
                    className="text-xs sm:text-sm">
                    <Trash2 className="h-4 w-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Delete </span>(
                    {selectedTexts.length})
                  </Button>
                </div>
              )}
            </div>

            {textSources.map((source) => {
              const textSource = source as any as TextSourceType;
              return (
                <Card key={source.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                        {/* Use Checkbox component for consistency */}
                        <div className="flex-shrink-0 pt-1 sm:pt-0">
                          <Checkbox
                            checked={selectedTexts.includes(source.id)}
                            onCheckedChange={() => handleSelectText(source.id)}
                          />
                        </div>
                        <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {source.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                            <span>Text</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="truncate">
                              Updated {formatDate(source.updated_at)}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 break-words">
                            {textSource.content?.substring(0, 150)}
                            {(textSource.content?.length || 0) > 150 && "..."}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
                        <Badge
                          variant={
                            source.status === "completed"
                              ? "default"
                              : source.status === "processing"
                              ? "secondary"
                              : source.status === "failed"
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs">
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
                            setViewerSources([source]);
                            setViewerOpen(true);
                          }}
                          className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteText(source.id, source.name)
                          }
                          className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
