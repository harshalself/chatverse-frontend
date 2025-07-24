export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  lastTrained: string;
}

export const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Harshal Patil Resume V2.pdf",
    description: "Resume assistant chatbot",
    status: "active",
    lastTrained: "2 hours ago",
  },
  {
    id: "2",
    name: "Customer Support Bot",
    description: "General customer support assistant",
    status: "active",
    lastTrained: "5 minutes ago",
  },
  {
    id: "3",
    name: "Product FAQ Bot",
    description: "Product information and FAQ assistant",
    status: "inactive",
    lastTrained: "1 day ago",
  },
];

export interface AgentHandlers {
  onAgentClick: (agentId: string) => void;
  onStatusChange: (agentId: string, newStatus: "active" | "inactive") => void;
  onCreateAgent: (name: string) => void;
}
