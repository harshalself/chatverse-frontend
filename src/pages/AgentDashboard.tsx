import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { SourcesSidebar } from "@/components/dashboard/SourcesSidebar";
import { DocumentFiles } from "@/components/dashboard/DocumentFiles";
import { TextSource } from "@/components/dashboard/TextSource";
import { WebsiteSource } from "@/components/dashboard/WebsiteSource";
import { DatabaseSource } from "@/components/dashboard/DatabaseSource";
import { QASource } from "@/components/dashboard/QASource";
import { SourcesSummary } from "@/components/dashboard/SourcesSummary";

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
            {activeSource === "text" && <TextSource />}
            {activeSource === "website" && <WebsiteSource />}
            {activeSource === "database" && <DatabaseSource />}
            {activeSource === "qa" && <QASource />}
            <SourcesSummary />
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