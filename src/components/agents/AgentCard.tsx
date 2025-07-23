import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  conversations: number;
  lastActive: string;
  onClick?: (id: string) => void;
}

export function AgentCard({ id, name, description, status, conversations, lastActive, onClick }: AgentCardProps) {
  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]"
      onClick={() => onClick?.(id)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-muted rounded-lg">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs",
              status === "active" 
                ? "bg-success/10 text-success border-success/20" 
                : "bg-muted text-muted-foreground"
            )}
          >
            {status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Conversations:</span>
            <span className="font-medium text-foreground">{conversations}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last active:</span>
            <span className="font-medium text-foreground">{lastActive}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}