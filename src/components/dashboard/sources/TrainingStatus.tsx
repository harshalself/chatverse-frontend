import React, { useEffect } from "react";
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrainingStatus } from "@/hooks/use-agents";

interface TrainingStatusProps {
  agentId: string;
  isVisible: boolean;
}

// Define status display function to avoid dynamic component mapping
function getStatusIcon(status: string) {
  switch (status) {
    case "not_started":
    case "pending":
      return <Clock className="h-5 w-5 text-muted-foreground" />;
    case "processing":
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "cancelled":
      return <AlertCircle className="h-5 w-5 text-orange-500" />;
    default:
      // Treat any unknown status as processing (e.g., "training" from backend)
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "not_started":
      return "Not Started";
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "completed":
      return "Training Completed";
    case "failed":
      return "Training Failed";
    case "cancelled":
      return "Training Cancelled";
    default:
      // Treat any unknown status as processing (e.g., "training" from backend)
      return "Processing";
  }
}

export function TrainingStatus({ agentId, isVisible }: TrainingStatusProps) {
  const {
    data: trainingStatus,
    isLoading,
    error,
  } = useTrainingStatus(agentId, isVisible);

  // Debug logging
  useEffect(() => {
    if (trainingStatus) {
      console.log(
        `TrainingStatus Component - Agent ${agentId}: ${trainingStatus.status}`,
        trainingStatus
      );
    }
  }, [trainingStatus, agentId]);

  // Don't render if not visible or if status is not_started
  if (
    !isVisible ||
    !trainingStatus ||
    trainingStatus.status === "not_started"
  ) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading training status...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !trainingStatus) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">
            No training status available
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusIcon = getStatusIcon(trainingStatus.status);
  const statusLabel = getStatusLabel(trainingStatus.status);

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5" />
          <span>Training Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          {statusIcon}
          <div>
            <div className="font-medium">{statusLabel}</div>
            {trainingStatus.startedAt && (
              <div className="text-sm text-muted-foreground">
                Started {new Date(trainingStatus.startedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {trainingStatus.status === "failed" && trainingStatus.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/30 dark:border-red-900/30">
            <div className="font-medium text-red-800 dark:text-red-200">
              {trainingStatus.error.message}
            </div>
            {trainingStatus.error.details && (
              <div className="text-sm mt-1 text-red-600 dark:text-red-300">
                {trainingStatus.error.details}
              </div>
            )}
          </div>
        )}

        {/* Completion Info */}
        {trainingStatus.status === "completed" &&
          trainingStatus.completedAt && (
            <div className="text-sm text-muted-foreground">
              Completed {new Date(trainingStatus.completedAt).toLocaleString()}
            </div>
          )}
      </CardContent>
    </Card>
  );
}
