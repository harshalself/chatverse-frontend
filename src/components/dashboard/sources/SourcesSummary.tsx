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
import { useAgent as useAgentContext } from "@/contexts";
import { useSourcesByAgent, useDeleteSource } from "@/hooks/use-base-sources";
import { useTrainAgent, useTrainingStatus, useAgent as useAgentData } from "@/hooks/use-agents";
import { toast } from "@/hooks/use-toast";
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
  const { currentAgentId, isAgentSelected } = useAgentContext();

  // Fetch current agent data to get trained_on timestamp
  const { data: currentAgent } = useAgentData(currentAgentId?.toString() || "", isAgentSelected);

  // Fetch all sources using the hook with agent context
  const {
    data: allSources,
    isLoading,
    refetch,
  } = useSourcesByAgent(currentAgentId || 0, isAgentSelected);

  // For delete functionality
  const { mutate: deleteSource } = useDeleteSource();

  // Training hooks
  const trainAgentMutation = useTrainAgent();
  const { 
    data: trainingStatus, 
    isLoading: isTrainingStatusLoading,
    refetch: refetchTrainingStatus 
  } = useTrainingStatus(currentAgentId?.toString() || "", isAgentSelected);

  // Use allSources directly from the hook instead of sourcesData
  const sources = allSources || [];

  // Calculate totals
  const totalAllSources = useMemo(
    () => sources.reduce((acc, source) => acc + getSourceCount(source), 0),
    [sources]
  );

  // Calculate ready sources (pending or completed status)
  const readySourcesCount = useMemo(
    () => sources
      .filter(source => source.status === "pending" || source.status === "completed")
      .reduce((acc, source) => acc + getSourceCount(source), 0),
    [sources]
  );

  // Training functions
  const handleTrainAgent = () => {
    // Check if agent is selected
    if (!isAgentSelected) {
      toast({
        title: "No Agent Selected",
        description: "Please select an agent before training.",
        variant: "destructive",
      });
      return;
    }

    // Check if there are sources
    if (totalAllSources === 0) {
      toast({
        title: "No Sources Available",
        description: "Add at least one data source before training the agent.",
        variant: "destructive",
      });
      return;
    }

    // Check if training is already in progress
    if (isTrainingInProgress) {
      toast({
        title: "Training in Progress",
        description: "Agent training is already in progress. Please wait for it to complete.",
        variant: "destructive",
      });
      return;
    }

    // Check if sources are ready for training (must be pending or completed status)
    const readySources = sources.filter(source => 
      source.status === "pending" || source.status === "completed"
    );
    
    if (readySources.length === 0) {
      const processingSources = sources.filter(source => source.status === "processing");
      const failedSources = sources.filter(source => source.status === "failed");
      
      let message = "No sources are ready for training.";
      if (processingSources.length > 0) {
        message += ` ${processingSources.length} source(s) are still processing.`;
      }
      if (failedSources.length > 0) {
        message += ` ${failedSources.length} source(s) failed to process.`;
      }
      
      toast({
        title: "Sources Not Ready",
        description: message + " Please wait for sources to complete processing or try again later.",
        variant: "destructive",
      });
      return;
    }

    // Check if agent is already trained and no new sources have been added since training
    if (trainingStatus?.status === "completed" && currentAgent?.trained_on) {
      const trainedOnTime = new Date(currentAgent.trained_on).getTime();
      
      // Check if any ready sources were created or updated after the training time
      const hasNewReadySources = readySources.some(source => {
        const createdTime = new Date(source.created_at).getTime();
        const updatedTime = source.updated_at ? new Date(source.updated_at).getTime() : createdTime;
        return createdTime > trainedOnTime || updatedTime > trainedOnTime;
      });

      // Only show "already trained" if there are no new ready sources since training
      if (!hasNewReadySources) {
        toast({
          title: "Agent Already Trained",
          description: "This agent is already trained. Add new sources or use retrain if needed.",
          variant: "destructive",
        });
        return;
      }
    }

    // Proceed with training
    if (currentAgentId) {
      trainAgentMutation.mutate({
        id: currentAgentId.toString(),
        data: { forceRetrain: false, cleanupExisting: true },
      }, {
        onSuccess: (response) => {
          toast({
            title: "Training Started! 🚀",
            description: response.message || "Agent training started successfully",
          });
        },
      });
    }
  };

  // Combined refresh function for sources and training status
  const handleRefresh = () => {
    refetch(); // Refresh sources
    if (currentAgentId) {
      refetchTrainingStatus(); // Refresh training status
    }
  };

  const isTrainingInProgress =
    trainingStatus?.status === "processing" ||
    trainingStatus?.status === "pending";

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
              onClick={handleRefresh}
              title="Refresh sources and training status"
              disabled={isLoading || isTrainingStatusLoading}>
              <RefreshCw
                className={`h-4 w-4 ${isLoading || isTrainingStatusLoading ? "animate-spin" : ""}`}
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
            disabled={trainAgentMutation.isPending}
            onClick={handleTrainAgent}
            title={
              !isAgentSelected
                ? "Select an agent first"
                : totalAllSources === 0
                ? "Add sources before training"
                : readySourcesCount === 0
                ? "Sources are still processing - wait for completion"
                : isTrainingInProgress
                ? "Training in progress"
                : trainingStatus?.status === "completed"
                ? "Agent already trained - add new sources or retrain"
                : ""
            }>
            {trainAgentMutation.isPending || isTrainingInProgress ? (
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
