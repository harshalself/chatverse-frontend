import { useState } from "react";
import {
  Globe,
  Plus,
  RefreshCw,
  Eye,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useDeleteSource } from "@/hooks/use-base-sources";
// NOTE: Website source specific hooks need to be implemented

export function WebsiteSource() {
  const [url, setUrl] = useState("");
  const [crawlDepth, setCrawlDepth] = useState("1");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  // TODO: Implement Website source hooks (useSourcesByType, useCreateWebsiteSource, useTestWebsiteConnection)
  // Temporary stubs to avoid errors
  const websiteSourcesData = { data: [] };
  const websiteSourcesLoading = false;
  const websiteSourcesError = null;
  const refetchWebsiteSources = () => {};
  const createLoading = false;
  const createWebsiteSource = () => {
    toast({
      title: "Not implemented",
      description: "Creating website sources is not yet implemented.",
      variant: "destructive",
    });
  };
  const testConnection = () => {
    toast({
      title: "Not implemented",
      description: "Testing website connection is not yet implemented.",
      variant: "destructive",
    });
    setIsTestingConnection(false);
  };

  const { mutate: deleteSource } = useDeleteSource();

  // (Removed duplicate testConnection declaration)

  const websiteSources = websiteSourcesData?.data || [];

  const handleTestConnection = () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a website URL to test the connection.",
        variant: "destructive",
      });
      return;
    }
    setIsTestingConnection(true);
    testConnection();
  };

  const handleAddWebsite = () => {
    if (url && crawlDepth) {
      createWebsiteSource();
    }
  };

  const handleDeleteWebsite = (id: string, name: string) => {
    deleteSource(Number(id), {
      onSuccess: () => {
        toast({
          title: "Website source deleted",
          description: `"${name}" has been removed from your knowledge base.`,
        });
        refetchWebsiteSources();
      },
      onError: () => {
        toast({
          title: "Failed to delete website source",
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
    <div className="flex-1 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Website Source
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Crawl websites to extract content for your knowledge base
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Add Website</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex flex-col xs:flex-row gap-2">
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={!url || isTestingConnection}
                className="xs:w-auto w-full">
                {isTestingConnection ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span className="ml-2 xs:hidden">Test Connection</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crawlDepth">Crawl Depth</Label>
            <Select value={crawlDepth} onValueChange={setCrawlDepth}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select crawl depth" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 level (current page only)</SelectItem>
                <SelectItem value="2">2 levels</SelectItem>
                <SelectItem value="3">3 levels</SelectItem>
                <SelectItem value="4">4 levels</SelectItem>
                <SelectItem value="5">5 levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAddWebsite}
            disabled={!url || createLoading}
            className="w-full sm:w-auto">
            {createLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {createLoading ? "Adding..." : "Add Website Source"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Website Sources */}
      <div className="mt-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4">
          Existing Website Sources
        </h3>

        {websiteSourcesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : websiteSourcesError ? (
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load website sources.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchWebsiteSources()}
                className="ml-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : websiteSources.length > 0 ? (
          <div className="space-y-4">
            {websiteSources.map((source) => (
              <Card key={source.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 p-2 bg-muted rounded-lg">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {source.name}
                        </h4>
                        <a
                          href={
                            source.metadata?.originalUrl || source.metadata?.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1 truncate">
                          <span className="truncate">
                            {source.metadata?.originalUrl ||
                              source.metadata?.url}
                          </span>
                          <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                        </a>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs text-muted-foreground mt-2">
                          <span>Updated {formatDate(source.updatedAt)}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>
                            Depth:{" "}
                            {source.metadata?.crawlDepth ||
                              source.metadata?.crawlSettings?.depth ||
                              1}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span>{source.metadata?.pageCount || 0} pages</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0">
                      <Badge
                        variant="secondary"
                        className={`text-xs
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
                            title: "Opening website source",
                            description: `Opening "${source.name}"...`,
                          });
                          // TODO: Implement website viewer
                        }}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteWebsite(source.id, source.name)
                        }
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9">
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
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="text-lg font-medium mb-2">
                No website sources yet
              </h4>
              <p className="text-muted-foreground">
                Add your first website source using the form above
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
