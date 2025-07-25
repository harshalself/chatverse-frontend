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
import {
  useCreateTextSource,
  useSourcesByType,
  useDeleteSource,
} from "@/hooks/use-sources";

export function TextSource() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();

  // Data hooks
  const {
    data: textSourcesData,
    isLoading: textSourcesLoading,
    error: textSourcesError,
    refetch: refetchTextSources,
  } = useSourcesByType("text");

  const { mutate: createTextSource, isPending: createLoading } =
    useCreateTextSource();

  const { mutate: deleteSource } = useDeleteSource();

  const textSources = textSourcesData?.data || [];

  const handleAddText = () => {
    if (title && content) {
      createTextSource(
        {
          name: title,
          type: "text",
          content: content,
          metadata: { source: "manual_entry" },
        },
        {
          onSuccess: (data) => {
            toast({
              title: "Text source created",
              description: `"${title}" has been added to your knowledge base.`,
            });
            setTitle("");
            setContent("");
            refetchTextSources();
          },
          onError: (error) => {
            toast({
              title: "Failed to create text source",
              description: "Please try again later.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDeleteText = (id: string, name: string) => {
    deleteSource(id, {
      onSuccess: () => {
        toast({
          title: "Text source deleted",
          description: `"${name}" has been removed from your knowledge base.`,
        });
        refetchTextSources();
      },
      onError: () => {
        toast({
          title: "Failed to delete text source",
          description: "Please try again later.",
          variant: "destructive",
        });
      },
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
            disabled={!title || !content || createLoading}>
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
        ) : textSources.length > 0 ? (
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
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {source.metadata?.content?.substring(0, 150) ||
                            source.metadata?.preview ||
                            "No preview available"}
                          {(source.metadata?.content?.length || 0) > 150 &&
                            "..."}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                          <span>Updated {formatDate(source.updatedAt)}</span>
                          <span>•</span>
                          <span>
                            {source.metadata?.content?.length || 0} characters
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={`
                        ${
                          source.status === "ready"
                            ? "bg-success/10 text-success border-success/20"
                            : ""
                        }
                        ${
                          source.status === "processing"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : ""
                        }
                        ${
                          source.status === "error"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : ""
                        }
                        ${
                          source.status === "pending"
                            ? "bg-muted/10 text-muted-foreground border-muted/20"
                            : ""
                        }
                      `}>
                        {source.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Opening text source",
                            description: `Opening "${source.name}"...`,
                          });
                          // TODO: Implement text viewer
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
              <p className="text-muted-foreground">
                Create your first text source using the form above
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
