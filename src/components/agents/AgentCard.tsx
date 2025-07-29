import { MessageSquare, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AgentCardStatus = "active" | "inactive" | "training" | "error";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  status: AgentCardStatus;
  lastTrained: string;
  onClick?: (id: string) => void;
  onStatusChange?: (id: string, status: "active" | "inactive") => void;
}

const getStatusColor = (status: AgentCardStatus) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "inactive":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "training":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "error":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getStatusIcon = (status: AgentCardStatus) => {
  switch (status) {
    case "training":
      return <Clock className="h-3 w-3" />;
    case "error":
      return <AlertCircle className="h-3 w-3" />;
    default:
      return null;
  }
};

export function AgentCard({
  id,
  name,
  description,
  status,
  lastTrained,
  onClick,
  onStatusChange,
}: AgentCardProps) {
  const isStatusToggleable = status === "active" || status === "inactive";

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={() => onClick?.(id)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-muted rounded-lg">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className={cn("text-xs", getStatusColor(status))}>
              {getStatusIcon(status)}
              <span className={getStatusIcon(status) ? "ml-1" : ""}>
                {status}
              </span>
            </Badge>

            {isStatusToggleable && (
              <Switch
                checked={status === "active"}
                onCheckedChange={(checked) =>
                  onStatusChange?.(id, checked ? "active" : "inactive")
                }
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last active:</span>
            <span className="font-medium text-foreground">{lastTrained}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
