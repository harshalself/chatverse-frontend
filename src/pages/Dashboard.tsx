import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { SourcesView } from "./dashboard/sources/SourcesView";
import { PlaygroundView } from "./dashboard/playground/PlaygroundView";
import { ActivityView } from "./dashboard/activity/ActivityView";
import { AnalyticsView } from "./dashboard/analytics/AnalyticsView";
import { SettingsView } from "./dashboard/settings/SettingsView";
import { useAgent } from "@/hooks/use-agents";

export default function Dashboard() {
  const { agentId } = useParams();
  const location = useLocation();

  // Try to get agent name from location state first, then fetch if needed
  const [agentName, setAgentName] = useState(
    location.state?.agentName || "Loading..."
  );

  // Fetch agent details if we don't have the name
  const { data: agentResponse } = useAgent(
    agentId || "",
    !location.state?.agentName && !!agentId
  );

  // Update agent name when data is fetched
  useEffect(() => {
    if (agentResponse?.data && !location.state?.agentName) {
      setAgentName(agentResponse.data.name);
    }
  }, [agentResponse, location.state?.agentName]);

  const [activeTab, setActiveTab] = useState("sources");
  const [activeSource, setActiveSource] = useState("files");

  const tabs = [
    { label: "Sources", value: "sources", isActive: activeTab === "sources" },
    {
      label: "Playground",
      value: "playground",
      isActive: activeTab === "playground",
    },
    {
      label: "Activity",
      value: "activity",
      isActive: activeTab === "activity",
    },
    {
      label: "Analytics",
      value: "analytics",
      isActive: activeTab === "analytics",
    },
    {
      label: "Settings",
      value: "settings",
      isActive: activeTab === "settings",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "sources":
        return (
          <SourcesView
            activeSource={activeSource}
            onSourceChange={setActiveSource}
          />
        );
      case "playground":
        return <PlaygroundView />;
      case "activity":
        return <ActivityView />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
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
