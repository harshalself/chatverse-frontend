import React, { createContext, useState, useContext, ReactNode } from "react";

interface AgentContextType {
  currentAgentId: number | null;
  setCurrentAgentId: (id: number | null) => void;
  isAgentSelected: boolean;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [currentAgentId, setCurrentAgentId] = useState<number | null>(null);

  const value = {
    currentAgentId,
    setCurrentAgentId,
    isAgentSelected: currentAgentId !== null,
  };

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);

  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }

  return context;
}
