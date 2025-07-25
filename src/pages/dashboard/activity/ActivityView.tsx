import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import { MessageSquare, Clock, BarChart3, Filter } from "lucide-react";

const activityItems = [
  { id: "conversations", label: "Conversations", icon: MessageSquare },
  { id: "logs", label: "Activity Logs", icon: Clock },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "filters", label: "Filters", icon: Filter },
];

export function ActivityView() {
  const [activeItem, setActiveItem] = useState("conversations");

  const renderContent = () => {
    switch (activeItem) {
      case "conversations":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Conversations</h2>
            <p className="text-muted-foreground">Recent conversation history and logs.</p>
          </div>
        );
      case "logs":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Activity Logs</h2>
            <p className="text-muted-foreground">Detailed activity and system logs.</p>
          </div>
        );
      case "performance":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Performance</h2>
            <p className="text-muted-foreground">Agent performance metrics and analytics.</p>
          </div>
        );
      case "filters":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Filters</h2>
            <p className="text-muted-foreground">Configure activity filters and search.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <ReusableSidebar
        title="Activity"
        items={activityItems}
        activeItem={activeItem}
        onItemChange={setActiveItem}
      />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
