import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  conversations: number;
  lastTrained: string;
  onClick?: (id: string) => void;
  onStatusChange?: (id: string, status: "active" | "inactive") => void;
}

export function AgentCard({ id, name, description, status, conversations, lastTrained, onClick, onStatusChange }: AgentCardProps) {
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
          <Switch 
            checked={status === "active"}
            onCheckedChange={(checked) => 
              onStatusChange?.(id, checked ? "active" : "inactive")
            }
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Conversations:</span>
            <span className="font-medium text-foreground">{conversations}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last trained:</span>
            <span className="font-medium text-foreground">{lastTrained}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}