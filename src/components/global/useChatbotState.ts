import { useState, useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ChatbotPreferences {
  lastSelectedAgentId: number | null;
  isCollapsed: boolean;
  position: { x: number; y: number };
}

const DEFAULT_PREFERENCES: ChatbotPreferences = {
  lastSelectedAgentId: null,
  isCollapsed: true,
  position: { x: 24, y: 24 }, // bottom-6 right-6
};

export function useChatbotState() {
  const [preferences, setPreferences] = useLocalStorage<ChatbotPreferences>(
    "chatbot-preferences",
    DEFAULT_PREFERENCES
  );
  
  const [isExpanded, setIsExpanded] = useState(!preferences.isCollapsed);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(
    preferences.lastSelectedAgentId
  );

  const toggleExpanded = useCallback(() => {
    console.log('[useChatbotState] toggleExpanded called');
    setIsExpanded((prev) => {
      const newValue = !prev;
      // Update localStorage immediately
      setPreferences((prevPrefs) => ({ ...prevPrefs, isCollapsed: !newValue }));
      return newValue;
    });
  }, [setPreferences]);
  
  const selectAgent = useCallback((agentId: number) => {
    console.log('[useChatbotState] selectAgent called with:', agentId);
    setSelectedAgentId(agentId);
    // Update localStorage immediately
    setPreferences((prevPrefs) => ({ ...prevPrefs, lastSelectedAgentId: agentId }));
  }, [setPreferences]);

  const collapse = useCallback(() => {
    console.log('[useChatbotState] collapse called');
    setIsExpanded(false);
    // Update localStorage immediately
    setPreferences((prevPrefs) => ({ ...prevPrefs, isCollapsed: true }));
  }, [setPreferences]);

  console.log('[useChatbotState] Hook render:', {
    isExpanded,
    selectedAgentId,
    preferences
  });

  return {
    isExpanded,
    selectedAgentId,
    toggleExpanded,
    selectAgent,
    collapse,
    preferences,
  };
}