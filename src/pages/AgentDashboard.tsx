import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { SourcesSidebar } from "@/components/dashboard/SourcesSidebar";
import { DocumentFiles } from "@/components/dashboard/DocumentFiles";

export default function AgentDashboard() {
  const { agentId } = useParams();
  const location = useLocation();
  const agentName = location.state?.agentName || "Unknown Agent";
  
  const [activeTab, setActiveTab] = useState("sources");
  const [activeSource, setActiveSource] = useState("files");

  const tabs = [
    { label: "Sources", value: "sources", isActive: activeTab === "sources" },
    { label: "Playground", value: "playground", isActive: activeTab === "playground" },
    { label: "Activity", value: "activity", isActive: activeTab === "activity" },
    { label: "Analytics", value: "analytics", isActive: activeTab === "analytics" },
    { label: "Settings", value: "settings", isActive: activeTab === "settings" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "sources":
        return (
          <div className="flex min-h-[calc(100vh-120px)]">
            <SourcesSidebar 
              activeSource={activeSource} 
              onSourceChange={setActiveSource} 
            />
            {activeSource === "files" && <DocumentFiles />}
            {activeSource !== "files" && (
              <div className="flex-1 p-6 max-w-7xl mx-auto">
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  {activeSource.charAt(0).toUpperCase() + activeSource.slice(1)}
                </h2>
                <p className="text-muted-foreground">
                  {activeSource} configuration and management will be available here.
                </p>
              </div>
            )}
          </div>
        );
      case "playground":
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Playground</h1>
            <p className="text-muted-foreground">Test and interact with your AI agent here.</p>
          </div>
        );
      case "activity":
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Activity</h1>
            <p className="text-muted-foreground">View conversation logs and activity history.</p>
          </div>
        );
      case "analytics":
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Analytics</h1>
            <p className="text-muted-foreground">Performance metrics and usage analytics.</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-4">Settings</h1>
            <p className="text-muted-foreground">Configure your agent settings and preferences.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header breadcrumbs={["Workspace", agentName]} />
      <Navigation tabs={tabs} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}