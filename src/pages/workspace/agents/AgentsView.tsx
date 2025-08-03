import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AgentCard } from "@/components/agents/AgentCard";
import { NewAgentDialog } from "@/components/agents/NewAgentDialog";
import { useAgents, useUpdateAgent, useDeleteAgent } from "@/hooks/use-agents";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

export function AgentsView() {
  const navigate = useNavigate();
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);

  // Fetch agents with pagination
  const {
    data: agentsResponse,
    isLoading,
    error,
    refetch,
  } = useAgents({ page: 1, limit: 20 });

  const updateAgentMutation = useUpdateAgent();
  const deleteAgentMutation = useDeleteAgent();

  const agents = agentsResponse?.data || [];

  const handleNewAgent = () => {
    setShowNewAgentDialog(true);
  };

  const handleAgentClick = (agentId: string) => {
    // Find the agent to get its name
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      // Navigate to agent dashboard with agent name in state
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

  const handleCreateAgent = async (agentId: string) => {
    // Navigate to the newly created agent or refresh the list
    // For now, we'll just refresh the agents list
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
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
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
        <Button
          onClick={handleNewAgent}
          className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New agent</span>
        </Button>
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
          <Button onClick={handleNewAgent}>Create your first agent</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              id={agent.id}
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
