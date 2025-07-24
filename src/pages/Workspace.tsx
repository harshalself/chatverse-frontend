import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { AgentCard } from "@/components/agents/AgentCard";
import { NewAgentDialog } from "@/components/agents/NewAgentDialog";
import { Button } from "@/components/ui/button";

const mockAgents = [
  {
    id: "1",
    name: "Harshal Patil Resume V2.pdf",
    description: "Resume assistant chatbot",
    status: "active" as const,
    lastTrained: "2 hours ago"
  },
  {
    id: "2", 
    name: "Customer Support Bot",
    description: "General customer support assistant",
    status: "active" as const,
    lastTrained: "5 minutes ago"
  },
  {
    id: "3",
    name: "Product FAQ Bot", 
    description: "Product information and FAQ assistant",
    status: "inactive" as const,
    lastTrained: "1 day ago"
  }
];

export default function Workspace() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const [agents, setAgents] = useState(mockAgents);

  const tabs = [
    { label: "Agents", value: "agents", isActive: activeTab === "agents" },
    { label: "Usage", value: "usage", isActive: activeTab === "usage" },
    { label: "Settings", value: "settings", isActive: activeTab === "settings" }
  ];

  const handleAgentClick = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      navigate(`/agent/${agentId}`, { state: { agentName: agent.name } });
    }
  };

  const handleCreateAgent = (name: string) => {
    const newAgent = {
      id: Date.now().toString(),
      name,
      description: "New AI assistant",
      status: "active" as const,
      lastTrained: "Just created"
    };
    setAgents([...agents, newAgent]);
    navigate(`/agent/${newAgent.id}`, { state: { agentName: newAgent.name } });
  };

  const handleStatusChange = (agentId: string, newStatus: "active" | "inactive") => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: newStatus }
        : agent
    ));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "agents":
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Agents</h1>
                <p className="text-muted-foreground mt-2">Manage and monitor your AI chatbot agents</p>
              </div>
              <Button 
                onClick={() => setShowNewAgentDialog(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New agent</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  {...agent}
                  onClick={handleAgentClick}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>
        );
      case "usage":
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Usage</h1>
            <p className="text-muted-foreground">Usage analytics and statistics will be displayed here.</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Settings</h1>
            <p className="text-muted-foreground">Workspace settings and configuration options.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumbs={["Workspace"]} />
      <Navigation tabs={tabs} onTabChange={setActiveTab} />
      {renderContent()}
      
      <NewAgentDialog
        open={showNewAgentDialog}
        onOpenChange={setShowNewAgentDialog}
        onCreateAgent={handleCreateAgent}
      />
    </div>
  );
}