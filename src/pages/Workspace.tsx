import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { NewAgentDialog } from "@/components/agents/NewAgentDialog";
import { AgentsView } from "./workspace/agents/AgentsView";
import { UsageView } from "./workspace/usage/UsageView";
import { SettingsView } from "./workspace/settings/SettingsView";

export default function Workspace() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("agents");
  const [showNewAgentDialog, setShowNewAgentDialog] = useState(false);

  const tabs = [
    { label: "Agents", value: "agents", isActive: activeTab === "agents" },
    { label: "Usage", value: "usage", isActive: activeTab === "usage" },
    {
      label: "Settings",
      value: "settings",
      isActive: activeTab === "settings",
    },
  ];

  const handleCreateAgent = (agentId: string) => {
    // Navigate to the newly created agent
    navigate(`/agent/${agentId}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "agents":
        return <AgentsView />;
      case "usage":
        return <UsageView />;
      case "settings":
        return <SettingsView />;
      default:
        return <AgentsView />;
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
