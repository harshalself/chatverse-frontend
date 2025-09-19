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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataSource } from "@/types/source.types";
import { useAgent } from "@/contexts";
import { useSourcesByAgent, useDeleteSource } from "@/hooks/use-base-sources";
import { useTrainAgent, useTrainingStatus } from "@/hooks/use-agents";
import {
  AllSourcesTable,
  sourceIcons as importedSourceIcons,
  sourceLabels as importedSourceLabels,
} from "./AllSourcesTable";
import { TrainingStatus } from "./TrainingStatus";

// Create a helper function to get count from metadata or properties
const getSourceCount = (source: DataSource): number => {
  // For TextSource, FileSource, QASource: count as 1 per source
  if (
    source.type === "text" ||
    source.type === "file" ||
    source.type === "qa"
  ) {
    return 1;
  }

  // For WebsiteSource - if we don't have page count data yet, count as 1 source
  if (source.type === "website") {
    const pageCount =
      source.pageCount ||
      source.metadata?.pageCount ||
      (source as any).page_count ||
      source.metadata?.page_count;

    // If pageCount is available and > 0, use it; otherwise count as 1 source
    return pageCount && pageCount > 0 ? pageCount : 1;
  }

  // For DatabaseSource - if we don't have record count data yet, count as 1 source
  if (source.type === "database") {
    const recordCount =
      source.recordCount ||
      source.metadata?.recordCount ||
      (source as any).record_count ||
      source.metadata?.record_count;

    // If recordCount is available and > 0, use it; otherwise count as 1 source
    return recordCount && recordCount > 0 ? recordCount : 1;
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

  // Training hooks
  const { mutate: trainAgent, isPending: isTraining } = useTrainAgent();
  const { data: trainingStatus, isLoading: isTrainingStatusLoading } =
    useTrainingStatus(currentAgentId?.toString() || "", isAgentSelected);

  // Use allSources directly from the hook instead of sourcesData
  const sources = allSources || [];

  // Calculate totals
  const totalAllSources = useMemo(
    () => sources.reduce((acc, source) => acc + getSourceCount(source), 0),
    [sources]
  );

  // Training functions
  const handleTrainAgent = () => {
    if (currentAgentId) {
      trainAgent({
        id: currentAgentId.toString(),
        data: { forceRetrain: false, cleanupExisting: true },
      });
    }
  };

  const isTrainingInProgress =
    trainingStatus?.status === "processing" ||
    trainingStatus?.status === "pending";
  const canTrain =
    isAgentSelected &&
    totalAllSources > 0 &&
    !isTraining &&
    !isTrainingInProgress;

  // Always show training status component when agent is selected - let the component handle visibility
  const showTrainingStatus = isAgentSelected && currentAgentId;

  return (
    <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-background p-4 sm:p-6 lg:sticky lg:top-16 z-40 lg:self-start">
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
            <div className="text-xs sm:text-sm text-amber-600 bg-amber-100/30 dark:bg-amber-900/30 p-3 rounded-md mb-3">
              Please select an agent to view sources.
            </div>
          )}

          {/* All Sources Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-xs sm:text-sm text-muted-foreground">
                ALL SOURCES
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                disabled={!isAgentSelected}
                onClick={() => setIsAllSourcesOpen(true)}>
                <span className="hidden xs:inline">View </span>All
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <div className="text-center p-3 sm:p-4 bg-muted/20 rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {totalAllSources}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total Sources Added
              </div>
            </div>
          </div>

          <Separator />

          {/* Source Type Counts Section */}
          <div className="space-y-3">
            {isLoading ? (
              <div className="text-xs sm:text-sm text-muted-foreground text-center py-2">
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
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {label}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs flex-shrink-0">
                      {count}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>

          <Separator />

          <Button
            className="w-full text-sm"
            size="lg"
            disabled={!canTrain}
            onClick={handleTrainAgent}
            title={
              !isAgentSelected
                ? "Select an agent first"
                : totalAllSources === 0
                ? "Add sources before training"
                : isTrainingInProgress
                ? "Training in progress"
                : ""
            }>
            {isTraining || isTrainingInProgress ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isTrainingInProgress ? "Training..." : "Train Agent"}
          </Button>

          {/* Training Status Component */}
          {showTrainingStatus && currentAgentId && (
            <TrainingStatus
              agentId={currentAgentId.toString()}
              isVisible={true}
            />
          )}
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
