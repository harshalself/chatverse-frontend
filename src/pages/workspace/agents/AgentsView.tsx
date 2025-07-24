import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentCard } from "@/components/agents/AgentCard";

import { Agent } from "./agentTypes";

interface AgentsViewProps {
  agents: Agent[];
  onNewAgent: () => void;
  onAgentClick: (agentId: string) => void;
  onStatusChange: (agentId: string, newStatus: "active" | "inactive") => void;
}

export function AgentsView({
  agents,
  onNewAgent,
  onAgentClick,
  onStatusChange,
}: AgentsViewProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your AI chatbot agents
          </p>
        </div>
        <Button onClick={onNewAgent} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New agent</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            {...agent}
            onClick={onAgentClick}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
