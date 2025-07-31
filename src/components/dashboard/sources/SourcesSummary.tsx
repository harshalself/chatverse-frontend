import { useState, useMemo } from "react";
import {
  Brain,
  FileText,
  Type,
  Globe,
  Database,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataSource } from "@/types/source.types";
import { useAgent } from "@/contexts";
import { useSources, useDeleteSource } from "@/hooks/use-sources";
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
    return source.pageCount || 0;
  }

  // For DatabaseSource
  if (source.type === "database") {
    return source.recordCount || 0;
  }

  // For QASource
  if (source.type === "qa") {
    return source.questions?.length || 0;
  }

  // Default fallback
  return 0;
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
    data: sourcesData,
    isLoading,
    refetch,
  } = useSources({
    page: 1,
    limit: 50,
    filter: currentAgentId ? { agentId: currentAgentId } : {},
  });

  // For delete functionality
  const { mutate: deleteSource } = useDeleteSource();

  // All sources from the API
  const allSources = useMemo(() => sourcesData?.data || [], [sourcesData]);

  // Current session sources - for this example, we'll use the 2 most recent sources
  const currentSessionSources = useMemo(() => {
    const sortedSources = [...allSources]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 2);

    return sortedSources;
  }, [allSources]);

  // Calculate totals
  const totalAllSources = useMemo(
    () => allSources.reduce((acc, source) => acc + getSourceCount(source), 0),
    [allSources]
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
    <div className="w-80 border-l bg-background p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Sources</span>
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

          {/* Current Session Sources Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Current Session Sources ({totalCurrentSessionSources})
            </h4>
            {isLoading ? (
              <div className="text-sm text-muted-foreground text-center py-2">
                Loading sources...
              </div>
            ) : currentSessionSources.length > 0 ? (
              currentSessionSources.map((source) => {
                const Icon = sourceIcons[source.type];
                const label = sourceLabels[source.type];
                const count = getSourceCount(source);

                return (
                  <div
                    key={source.id}
                    className="flex items-center justify-between">
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
            ) : (
              <div className="text-sm text-muted-foreground text-center py-2">
                No sources in current session
              </div>
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
        sources={allSources}
        isOpen={isAllSourcesOpen}
        onClose={() => setIsAllSourcesOpen(false)}
        onRefresh={() => refetch()}
      />
    </div>
  );
}
