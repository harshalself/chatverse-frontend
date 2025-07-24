import { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Navigation } from "@/components/layout/Navigation";
import { SourcesView } from "./dashboard/sources/SourcesView";
import { PlaygroundView } from "./dashboard/playground/PlaygroundView";
import { ActivityView } from "./dashboard/activity/ActivityView";
import { AnalyticsView } from "./dashboard/analytics/AnalyticsView";
import { SettingsView } from "./dashboard/settings/SettingsView";

export default function Dashboard() {
  const { agentId } = useParams();
  const location = useLocation();
  const agentName = location.state?.agentName || "Unknown Agent";

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
