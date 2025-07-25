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
import {
  useCreateWebsiteSource,
  useSourcesByType,
  useDeleteSource,
  useTestWebsiteConnection,
} from "@/hooks/use-sources";

export function WebsiteSource() {
  const [url, setUrl] = useState("");
  const [crawlDepth, setCrawlDepth] = useState("1");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  // Data hooks
  const {
    data: websiteSourcesData,
    isLoading: websiteSourcesLoading,
    error: websiteSourcesError,
    refetch: refetchWebsiteSources,
  } = useSourcesByType("website");

  const { mutate: createWebsiteSource, isPending: createLoading } =
    useCreateWebsiteSource();

  const { mutate: deleteSource } = useDeleteSource();

  const { mutate: testConnection } = useTestWebsiteConnection();

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
    testConnection(url, {
      onSuccess: (data) => {
        setIsTestingConnection(false);
        toast({
          title: "Connection successful",
          description: `Successfully connected to ${url}`,
        });
      },
      onError: (error) => {
        setIsTestingConnection(false);
        toast({
          title: "Connection failed",
          description: `Could not connect to ${url}. Please check the URL and try again.`,
          variant: "destructive",
        });
      },
    });
  };

  const handleAddWebsite = () => {
    if (url && crawlDepth) {
      createWebsiteSource(
        {
          name: new URL(url).hostname,
          url: url,
          crawlDepth: parseInt(crawlDepth),
        },
        {
          onSuccess: (data) => {
            toast({
              title: "Website source created",
              description: `Started crawling ${url}. This may take a few minutes.`,
            });
            setUrl("");
            setCrawlDepth("1");
            refetchWebsiteSources();
          },
          onError: (error) => {
            toast({
              title: "Failed to create website source",
              description: "Please check the URL and try again.",
              variant: "destructive",
            });
          },
        }
      );
    }
  };

  const handleDeleteWebsite = (id: string, name: string) => {
    deleteSource(id, {
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
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Website Source
          </h2>
          <p className="text-muted-foreground">
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
            <div className="flex space-x-2">
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
                disabled={!url || isTestingConnection}>
                {isTestingConnection ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crawlDepth">Crawl Depth</Label>
            <Select value={crawlDepth} onValueChange={setCrawlDepth}>
              <SelectTrigger>
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

          <Button onClick={handleAddWebsite} disabled={!url || createLoading}>
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
        <h3 className="text-lg font-semibold mb-4">Existing Website Sources</h3>

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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-muted rounded-lg">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {source.name}
                        </h4>
                        <a
                          href={
                            source.metadata?.originalUrl || source.metadata?.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1">
                          {source.metadata?.originalUrl || source.metadata?.url}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                          <span>Updated {formatDate(source.updatedAt)}</span>
                          <span>•</span>
                          <span>
                            Depth:{" "}
                            {source.metadata?.crawlDepth ||
                              source.metadata?.crawlSettings?.depth ||
                              1}
                          </span>
                          <span>•</span>
                          <span>{source.metadata?.pageCount || 0} pages</span>
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
                            title: "Opening website source",
                            description: `Opening "${source.name}"...`,
                          });
                          // TODO: Implement website viewer
                        }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteWebsite(source.id, source.name)
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
