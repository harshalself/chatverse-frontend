import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import { Clock } from "lucide-react";
import { ReadOnlyChat } from "@/components/dashboard/activity/ReadOnlyChat";
import { SessionsList } from "@/components/dashboard/activity/SessionsList";
import { useAgent } from "@/contexts/AgentContext";
import { useAgent as useAgentDetails } from "@/hooks/use-agents";

const activityItems = [{ id: "activity", label: "Activity", icon: Clock }];

export function ActivityView() {
  const [activeItem, setActiveItem] = useState("activity");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null
  );

  // Get current agent from context
  const { currentAgentId } = useAgent();

  // Get agent details
  const { data: agentDetails } = useAgentDetails(
    currentAgentId?.toString() || "",
    !!currentAgentId
  );

  const handleSessionSelect = (sessionId: number) => {
    setSelectedSessionId(sessionId);
  };

  const renderActivityContent = () => (
    <div className="flex h-full">
      <SessionsList
        selectedSessionId={selectedSessionId}
        onSessionSelect={handleSessionSelect}
      />
      <ReadOnlyChat
        sessionId={selectedSessionId}
        agentId={currentAgentId || undefined}
        agentName={agentDetails?.name || "AI Assistant"}
      />
    </div>
  );

  const renderContent = () => {
    switch (activeItem) {
      case "activity":
        return renderActivityContent();
      default:
        return renderActivityContent();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <ReusableSidebar
        title="Activity"
        items={activityItems}
        activeItem={activeItem}
        onItemChange={setActiveItem}
      />
      <main className="flex-1 overflow-hidden">{renderContent()}</main>
    </div>
  );
}
