import { useState } from "react";
import { ReadOnlyChat } from "@/components/dashboard/activity/ReadOnlyChat";
import { SessionsList } from "@/components/dashboard/activity/SessionsList";
import { useAgent } from "@/contexts/AgentContext";
import { useAgent as useAgentDetails } from "@/hooks/use-agents";

export function ActivityView() {
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

  return (
    <div className="flex h-[calc(100vh-120px)]">
      <main className="flex-1 overflow-hidden">
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
      </main>
    </div>
  );
}
