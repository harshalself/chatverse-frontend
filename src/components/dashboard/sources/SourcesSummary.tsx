import { useState, useMemo } from "react";
import {
  Brain,
  FileText,
  Type,
  Globe,
  Database,
  HelpCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataSource } from "@/types/source.types";
import { useAgent } from "@/contexts";
import { useSourcesByAgent, useDeleteSource } from "@/hooks/use-base-sources";
import {
  AllSourcesTable,
  sourceIcons as importedSourceIcons,
  sourceLabels as importedSourceLabels,
} from "./AllSourcesTable";

// Create a helper function to get count from metadata or properties
const getSourceCount = (source: DataSource): number => {
  // For TextSource
  if (source.type === "text") {
    return 1;
  }

  // For WebsiteSource
  if (source.type === "website") {
    return source.pageCount || source.metadata?.pageCount || 0;
  }

  // For DatabaseSource
  if (source.type === "database") {
    return source.recordCount || source.metadata?.recordCount || 0;
  }

  // For QASource
  if (source.type === "qa") {
    return source.questions?.length || source.metadata?.questions?.length || 0;
  }

  // For FileSource
  if (source.type === "file") {
    return source.metadata?.fileCount || 1;
  }

  // Default fallback
  return 1;
};

// Re-export the icons and labels
const sourceIcons = importedSourceIcons;
const sourceLabels = importedSourceLabels;

export function SourcesSummary() {
  const [isAllSourcesOpen, setIsAllSourcesOpen] = useState(false);

  // Get the current agent ID from context
  const { currentAgentId, isAgentSelected } = useAgent();

  // Fetch all sources using the hook with agent context
  const {
    data: allSources,
    isLoading,
    refetch,
  } = useSourcesByAgent(currentAgentId || 0, isAgentSelected);

  // For delete functionality
  const { mutate: deleteSource } = useDeleteSource();

  // Use allSources directly from the hook instead of sourcesData
  const sources = allSources || [];

  // Current session sources - for this example, we'll use the 2 most recent sources
  const currentSessionSources = useMemo(() => {
    const sortedSources = [...sources]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 2);

    return sortedSources;
  }, [sources]);

  // Calculate totals
  const totalAllSources = useMemo(
    () => sources.reduce((acc, source) => acc + getSourceCount(source), 0),
    [sources]
  );

  const totalCurrentSessionSources = useMemo(
    () =>
      currentSessionSources.reduce(
        (acc, source) => acc + getSourceCount(source),
        0
      ),
    [currentSessionSources]
  );

  return (
    <div className="w-80 border-l bg-background p-6 sticky top-16 z-40 self-start">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 justify-between">
            <span className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Sources</span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => refetch()}
              title="Refresh sources"
              disabled={isLoading}>
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isAgentSelected && (
            <div className="text-sm text-amber-600 bg-amber-100/30 dark:bg-amber-900/30 p-3 rounded-md mb-3">
              Please select an agent to view sources.
            </div>
          )}

          {/* All Sources Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground">
                ALL SOURCES
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                disabled={!isAgentSelected}
                onClick={() => setIsAllSourcesOpen(true)}>
                View All
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {totalAllSources}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Sources Added
              </div>
            </div>
          </div>

          <Separator />

          {/* Source Type Counts Section */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-muted-foreground text-center py-2">
                Loading sources...
              </div>
            ) : (
              Object.entries(sourceLabels).map(([type, label]) => {
                const Icon = sourceIcons[type];
                // Count all sources of this type
                const count = sources.filter((s) => s.type === type).length;
                if (count === 0) return null;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>

          <Separator />

          <Button
            className="w-full"
            size="lg"
            disabled={!isAgentSelected}
            title={!isAgentSelected ? "Select an agent first" : ""}>
            <Brain className="h-4 w-4 mr-2" />
            Train Agent
          </Button>
        </CardContent>
      </Card>

      {/* All Sources Table Dialog */}
      <AllSourcesTable
        sources={sources}
        isOpen={isAllSourcesOpen}
        onClose={() => setIsAllSourcesOpen(false)}
        onRefresh={() => refetch()}
      />
    </div>
  );
}
