import { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowUp, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentSelector } from "./AgentSelector";
import { useAgent as useAgentDetails } from "@/hooks/use-agents";
import { useSendAgentChatMessage } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Message types for the mini chat
export interface MiniMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatbotExpandedProps {
  selectedAgentId: number | null;
  onAgentSelect: (agentId: number) => void;
  onClose: () => void;
  messages: MiniMessage[];
  isLoading: boolean;
  className?: string;
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onClearChat: () => void;
}

export function createMiniMessage(role: "user" | "assistant", content: string): MiniMessage {
  return {
    id: `${Date.now()}-${Math.random()}`,
    role,
    content,
    timestamp: new Date(),
  };
}

function MiniMessageComponent({ message }: { message: MiniMessage }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-2 mb-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          isUser ? "bg-primary" : "bg-primary/10"
        )}
      >
        {isUser ? (
          <span className="text-xs font-bold text-primary-foreground">U</span>
        ) : (
          <Sparkles className="h-3 w-3 text-primary" />
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-3 py-2 text-sm",
          isUser
            ? "bg-primary text-primary-foreground ml-2"
            : "bg-muted/50 text-foreground mr-2"
        )}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-1">{children}</ol>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              code: ({ children }) => (
                <code className="bg-muted/50 px-1 py-0.5 rounded text-xs">{children}</code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export function ChatbotExpanded({
  selectedAgentId,
  onAgentSelect,
  onClose,
  messages,
  isLoading,
  className,
  input,
  onInputChange,
  onSendMessage,
  onClearChat,
}: ChatbotExpandedProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get agent details
  const { data: agentDetails } = useAgentDetails(
    selectedAgentId?.toString() || "",
    !!selectedAgentId
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className={cn("w-96 h-[600px]", className)}>
      <Card className="h-full shadow-xl border-0 ring-1 ring-border">
        <CardContent className="flex flex-col p-0 h-full">
          {/* Header - Agent Selector with Refresh Button */}
          <div className="border-b border-border/50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <AgentSelector
                  selectedAgentId={selectedAgentId}
                  onAgentSelect={onAgentSelect}
                />
              </div>
              <Button
                onClick={onClearChat}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted"
                title="Clear chat and start new session"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4">
            <div className="py-2">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full px-4">
                  <div className="text-center max-w-md">
                    <p className="text-sm text-muted-foreground">
                      {selectedAgentId ? "Start a conversation with your selected agent" : "Select an agent to begin chatting"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <MiniMessageComponent key={message.id} message={message} />
                  ))}
                  {isLoading && (
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-pulse" />
                          <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-pulse [animation-delay:0.2s]" />
                          <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-pulse [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </ScrollArea>

          {/* Input Area at the bottom */}
          <div className="border-t border-border/50 p-4">
            <div className="relative w-full">
              <Textarea
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedAgentId ? "Type your message..." : "Select an agent first"
                }
                disabled={!selectedAgentId || isLoading}
                className="resize-none bg-muted/50 border-border/50 rounded-xl pr-12 pt-3 pb-3 min-h-[36px] max-h-[120px] text-sm placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full"
                rows={1}
              />
              <Button
                onClick={onSendMessage}
                disabled={!input.trim() || !selectedAgentId || isLoading}
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                <ArrowUp className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}