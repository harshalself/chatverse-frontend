import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check } from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { cn } from "@/lib/utils";

interface AgentSelectorProps {
  selectedAgentId: number | null;
  onAgentSelect: (agentId: number) => void;
  className?: string;
}

export function AgentSelector({
  selectedAgentId,
  onAgentSelect,
  className,
}: AgentSelectorProps) {
  const { data: agentsResponse, isLoading } = useAgents();

  // Extract agents array from response and filter only active agents
  const allAgents = Array.isArray(agentsResponse)
    ? agentsResponse
    : Array.isArray(agentsResponse?.data)
    ? agentsResponse.data
    : Array.isArray(agentsResponse?.agents)
    ? agentsResponse.agents
    : [];

  // Filter only active agents
  const agents = allAgents.filter((agent) => agent.is_active);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading agents...</span>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className={cn("text-center py-2", className)}>
        <span className="text-sm text-muted-foreground">No active agents available</span>
      </div>
    );
  }

  return (
    <Select
      value={selectedAgentId?.toString() || ""}
      onValueChange={(value) => onAgentSelect(parseInt(value, 10))}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue>
          {selectedAgent ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="font-medium text-sm">{selectedAgent.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Select an agent</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id.toString()}>
            <div className="flex items-center gap-2 w-full">
              <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="font-medium text-sm">{agent.name}</span>
              {agent.id === selectedAgentId && (
                <Check className="h-3 w-3 text-primary ml-auto" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}