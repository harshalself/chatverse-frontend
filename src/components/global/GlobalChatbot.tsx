import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatbotIcon } from "./ChatbotIcon";
import { ChatbotExpanded, type MiniMessage, createMiniMessage } from "./ChatbotExpanded";
import { useChatbotState } from "./useChatbotState";
import { useAuth } from "@/hooks/use-auth";
import { useAgents } from "@/hooks/use-agents";
import { useSendAgentChatMessage } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

interface GlobalChatbotProps {
  className?: string;
}

// Pages where chatbot should NOT be shown
const EXCLUDED_PAGES = ["/", "/signin", "/signup"];

export function GlobalChatbot({ className }: GlobalChatbotProps) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  // Only fetch agents when user is authenticated
  const { data: agentsResponse } = useAgents({ enabled: isAuthenticated });
  
  const {
    isExpanded,
    selectedAgentId,
    toggleExpanded,
    selectAgent,
    collapse,
  } = useChatbotState();

  // Chat state
  const [messages, setMessages] = useState<MiniMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Chat mutation
  const { mutate: sendAgentMessage } = useSendAgentChatMessage();

  // Don't show chatbot on excluded pages or when not authenticated
  const shouldShowChatbot = user && !EXCLUDED_PAGES.includes(location.pathname);

  console.log('[GlobalChatbot] shouldShowChatbot:', shouldShowChatbot);

  console.log('[GlobalChatbot] Component render:', {
    location: location.pathname,
    user: !!user,
    agentsResponse,
    isExpanded,
    selectedAgentId
  });

  // Memoize agents array to prevent unnecessary re-renders
  const agents = useMemo(() => {
    const result = Array.isArray(agentsResponse)
      ? agentsResponse
      : Array.isArray(agentsResponse?.data)
      ? agentsResponse.data
      : Array.isArray(agentsResponse?.agents)
      ? agentsResponse.agents
      : [];
    
    console.log('[GlobalChatbot] Agents memoized:', result.length, 'agents');
    return result;
  }, [agentsResponse]);

  // Store selectAgent in a ref to avoid dependency issues
  const selectAgentRef = useRef(selectAgent);
  selectAgentRef.current = selectAgent;

  // Auto-select first active agent if none selected (run only once when agents load)
  useEffect(() => {
    console.log('[GlobalChatbot] useEffect running:', {
      agentsLength: agents.length,
      selectedAgentId,
      agents: agents.map(a => ({ id: a.id, name: a.name, active: a.is_active }))
    });
    
    if (agents.length > 0 && !selectedAgentId) {
      const activeAgent = agents.find((agent) => agent.is_active);
      const firstAgent = activeAgent || agents[0];
      console.log('[GlobalChatbot] Auto-selecting agent:', firstAgent);
      if (firstAgent) {
        selectAgentRef.current(firstAgent.id);
      }
    }
  }, [agents.length, selectedAgentId]);

  // Handle message sending - now with session persistence
  const handleSendMessage = () => {
    if (!input.trim() || !selectedAgentId || isLoading) return;

    const userMessage = createMiniMessage("user", input);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Send message to agent with session ID if available
    sendAgentMessage(
      {
        agentId: selectedAgentId,
        messages: [{ role: "user", content: input }],
        sessionId: currentSessionId, // Pass current session ID to maintain conversation
      },
      {
        onSuccess: (response) => {
          console.log('[GlobalChatbot] Chat response received:', response);
          
          // Extract the actual AI message from the response
          // After ChatService.sendAgentChatMessage, response is already the data object
          // So response.message is the AI's response
          const aiMessage = response.message || (response as any).data?.message || "I received your message!";
          
          console.log('[GlobalChatbot] Extracted AI message:', aiMessage);
          
          const assistantMessage = createMiniMessage("assistant", aiMessage);
          setMessages((prev) => [...prev, assistantMessage]);
          
          // Store session ID for future messages in this conversation
          if (!currentSessionId) {
            const sessionId = (response as any).sessionId || (response as any).data?.sessionId;
            if (sessionId) {
              setCurrentSessionId(sessionId.toString());
              console.log('[GlobalChatbot] Session ID stored:', sessionId);
            }
          }
          
          setIsLoading(false);
        },
        onError: () => {
          const errorMessage = createMiniMessage(
            "assistant",
            "Sorry, I encountered an error. Please try again."
          );
          setMessages((prev) => [...prev, errorMessage]);
          setIsLoading(false);
        },
      }
    );
  };

  // Handle clearing chat and starting new session
  const handleClearChat = () => {
    setMessages([]);
    setInput("");
    setCurrentSessionId(null); // Reset session ID to start a new session
    setIsLoading(false);
  };

  // Enhanced agent selection handler that auto-clears chat
  const handleAgentSelect = (agentId: number) => {
    // Only clear chat if switching to a different agent (not initial selection)
    if (selectedAgentId && selectedAgentId !== agentId) {
      handleClearChat();
    }
    selectAgent(agentId);
  };

  // Handle ESC key to close chatbot
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        collapse();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded, collapse]);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);

  // Early return AFTER all hooks have been called
  if (!shouldShowChatbot) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "transition-all duration-200",
        className
      )}
    >
      {isExpanded ? (
        <div className="flex flex-col items-end">
          {/* Chatbot with input at bottom */}
          <div className="mb-3">
            <ChatbotExpanded
              selectedAgentId={selectedAgentId}
              onAgentSelect={handleAgentSelect}
              onClose={collapse}
              messages={messages}
              isLoading={isLoading}
              input={input}
              onInputChange={setInput}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
            />
          </div>
          
          {/* Icon at bottom showing down arrow */}
          <ChatbotIcon
            isExpanded={isExpanded}
            onClick={collapse}
            hasUnreadMessages={false}
          />
        </div>
      ) : (
        <ChatbotIcon
          isExpanded={isExpanded}
          onClick={toggleExpanded}
          hasUnreadMessages={false}
        />
      )}
    </div>
  );
}