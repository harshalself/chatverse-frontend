import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { NewAgentDialog } from "@/components/agents/NewAgentDialog";
import { AgentsView } from "./workspace/agents/AgentsView";
import { UsageView } from "./workspace/usage/UsageView";
import { SettingsView } from "./workspace/settings/SettingsView";
import { mockAgents, Agent } from "./workspace/agents/agentTypes";

export default function Workspace() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);
  const [agents, setAgents] = useState(mockAgents);

  const tabs = [
    { label: "Agents", value: "agents", isActive: activeTab === "agents" },
    { label: "Usage", value: "usage", isActive: activeTab === "usage" },
    {
      label: "Settings",
      value: "settings",
      isActive: activeTab === "settings",
    },
  ];

  const handleAgentClick = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (agent) {
      navigate(`/agent/${agentId}`, { state: { agentName: agent.name } });
    }
  };

  const handleCreateAgent = (name: string) => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      description: "New AI assistant",
      status: "active",
      lastTrained: "Just created",
    };
    setAgents([...agents, newAgent]);
    navigate(`/agent/${newAgent.id}`, { state: { agentName: newAgent.name } });
  };

  const handleStatusChange = (
    agentId: string,
    newStatus: "active" | "inactive"
  ) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "agents":
        return (
          <AgentsView
            agents={agents}
            onNewAgent={() => setShowNewAgentDialog(true)}
            onAgentClick={handleAgentClick}
            onStatusChange={handleStatusChange}
          />
        );
      case "usage":
        return <UsageView />;
      case "settings":
        return <SettingsView />;
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
