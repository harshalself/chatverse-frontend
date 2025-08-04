import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgentCard } from "@/components/agents/AgentCard";
import { useAgents, useUpdateAgent } from "@/hooks/use-agents";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { NewAgentDialog } from "@/components/agents/NewAgentDialog";

export function AgentsView() {
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const navigate = useNavigate();
  const { data: agentsResponse, isLoading, error, refetch } = useAgents();
  const updateAgentMutation = useUpdateAgent();

  // Robust fallback for agents array
  const agents = Array.isArray(agentsResponse)
    ? agentsResponse
    : Array.isArray(agentsResponse?.data)
    ? agentsResponse.data
    : Array.isArray(agentsResponse?.agents)
    ? agentsResponse.agents
    : [];

  const handleAgentClick = (agentId: string) => {
    const agent = agents.find((a) => String(a.id) === String(agentId));
    if (agent) {
      navigate(`/agent/${agentId}`, {
        state: { agentName: agent.name },
      });
    }
  };

  const handleStatusChange = async (
    agentId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      await updateAgentMutation.mutateAsync({
        id: agentId,
        data: { is_active: newStatus === "active" ? 1 : 0 },
      });
      toast({
        title: "Agent updated",
        description: `Agent status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Failed to update agent status:", error);
    }
  };

  // When a new agent is created, close dialog and refetch
  const handleCreateAgent = () => {
    setShowNewAgentDialog(false);
    refetch();
  };

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load agents. Please try again.
          </AlertDescription>
        </Alert>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 rounded bg-primary text-white">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your AI chatbot agents
          </p>
        </div>
        <Button onClick={() => setShowNewAgentDialog(true)}>+ New Agent</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No agents found</div>
          <Button onClick={() => setShowNewAgentDialog(true)}>
            Create your first agent
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              id={String(agent.id)}
              name={agent.name}
              description={`${agent.provider} - ${
                agent.model || "Default model"
              }`}
              status={agent.is_active ? "active" : "inactive"}
              trainedOn={agent.trained_on}
              onClick={handleAgentClick}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <NewAgentDialog
        open={showNewAgentDialog}
        onOpenChange={setShowNewAgentDialog}
        onCreateAgent={handleCreateAgent}
      />
    </div>
  );
}
