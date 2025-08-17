import { useState, memo, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import {
  useSendChatMessage,
  useSendAgentChatMessage,
  useSessionHistory,
} from "@/hooks/use-chat";
import { useAgent as useAgentContext } from "@/contexts/AgentContext";
import { useAgent as useAgentDetails } from "@/hooks/use-agents";
import { SessionSidebar } from "./SessionSidebar";
import type {
  UIMessage as ChatUIMessage,
  Message,
  HistoryMessage,
} from "@/types/chat.types";

// Markdown component configuration
const components: Partial<Components> = {
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => (
    <ol className="list-decimal list-outside ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, ...props }) => (
    <li className="py-1" {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className="list-disc list-outside ml-4" {...props}>
      {children}
    </ul>
  ),
  strong: ({ node, children, ...props }) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, href, ...props }) => (
    <a
      className="text-blue-500 hover:underline"
      target="_blank"
      rel="noreferrer"
      href={href || "#"}
      {...props}>
      {children}
    </a>
  ),
  h1: ({ node, children, ...props }) => (
    <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, ...props }) => (
    <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, ...props }) => (
    <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ node, children, ...props }) => (
    <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
      {children}
    </h6>
  ),
};

const remarkPlugins = [remarkGfm];

const Markdown = memo(({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
    {children}
  </ReactMarkdown>
));

// ReasoningMessagePart component
function ReasoningMessagePart({
  part,
  isReasoning,
}: {
  part: { type: string; text?: string };
  isReasoning: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variants = {
    collapsed: { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "0.5rem",
      marginBottom: 0,
    },
  };

  const memoizedSetIsExpanded = useCallback((value: boolean) => {
    setIsExpanded(value);
  }, []);

  useEffect(() => {
    memoizedSetIsExpanded(isReasoning);
  }, [isReasoning, memoizedSetIsExpanded]);

  return (
    <div className="flex flex-col rounded-lg bg-muted/30 p-3">
      {isReasoning ? (
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-foreground">Thinking...</div>
          <div className="animate-spin">
            <SpinnerIcon className="text-muted-foreground" />
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 hover:bg-muted/50 rounded-md p-1 -m-1 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}>
          <div className="text-sm font-medium text-foreground">Reasoning</div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && part.text && (
          <motion.div
            key="reasoning"
            className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border/50"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}>
            <Markdown>{part.text}</Markdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// SpinnerIcon component
function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="h-4 w-4 text-zinc-400"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Message Types
interface MessagePart {
  type: "text" | "reasoning";
  text?: string;
}

interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts?: MessagePart[];
}

// Message component
const PureMessage = ({
  message,
  isLatestMessage,
  status,
}: {
  message: UIMessage;
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
  isLatestMessage: boolean;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full group/message mb-6"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={`message-${message.id}`}
        data-role={message.role}>
        <div
          className={cn(
            "flex gap-4 w-full",
            message.role === "user" && "flex-row-reverse"
          )}>
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center bg-primary/10 shrink-0">
              <Sparkles size={14} className="text-primary" />
            </div>
          )}

          <div
            className={cn(
              "flex flex-col space-y-2 max-w-[80%]",
              message.role === "user" && "items-end"
            )}>
            {message.parts?.map((part, i) => {
              if (part.type === "text") {
                return (
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    key={`message-${message.id}-part-${i}`}
                    className={cn(
                      "rounded-xl px-4 py-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-foreground"
                    )}>
                    <Markdown>{part.text || ""}</Markdown>
                  </motion.div>
                );
              }
              if (part.type === "reasoning") {
                return (
                  <ReasoningMessagePart
                    key={`message-${message.id}-${i}`}
                    part={part}
                    isReasoning={
                      (message.parts &&
                        status === "streaming" &&
                        i === message.parts.length - 1) ??
                      false
                    }
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Message = memo(PureMessage, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (
    JSON.stringify(prevProps.message.parts) !==
    JSON.stringify(nextProps.message.parts)
  )
    return false;
  return true;
});

// Messages component
function Messages({
  messages,
  isLoading,
  status,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
}) {
  // Use useEffect to handle scrolling when messages change
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <div className="size-16 flex items-center rounded-full justify-center bg-muted/50 mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Start a conversation
          </h3>
          <p className="text-sm text-muted-foreground">
            Ask me anything, and I'll do my best to help you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-full pb-4">
      <div className="max-w-4xl mx-auto">
        {messages.map((m, i) => (
          <Message
            key={i}
            isLatestMessage={i === messages.length - 1}
            isLoading={isLoading}
            message={m}
            status={status}
          />
        ))}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}

// ChatTextarea component
function ChatTextarea({
  input,
  handleInputChange,
  isLoading,
  status,
  stop,
}: {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
  status: string;
  stop: () => void;
}) {
  return (
    <div className="relative w-full">
      <ShadcnTextarea
        className="resize-none bg-muted/50 border-border/50 w-full rounded-xl pr-12 pt-3 pb-3 min-h-[52px] max-h-[120px] text-sm placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        value={input}
        autoFocus
        placeholder="Type your message..."
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              const form = (e.target as HTMLElement).closest("form");
              if (form) form.requestSubmit();
            }
          }
        }}
      />
      {status === "streaming" || status === "submitted" ? (
        <button
          type="button"
          onClick={stop}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-all duration-200">
          <div className="animate-spin h-4 w-4">
            <SpinnerIcon className="text-primary-foreground" />
          </div>
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-all duration-200">
          <ArrowUp className="h-4 w-4 text-primary-foreground" />
        </button>
      )}
    </div>
  );
}

function createUIMessage({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}): UIMessage {
  return {
    id: Math.random().toString(36).slice(2),
    role,
    content,
    parts: [{ type: "text", text: content }],
  };
}

export function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [status, setStatus] = useState<
    "ready" | "streaming" | "submitted" | "error"
  >("ready");

  // Get URL parameters
  const { agentId, sessionId } = useParams();
  const navigate = useNavigate();

  // Convert sessionId from URL to number
  const currentSessionId = sessionId ? parseInt(sessionId, 10) : null;

  // Get current agent from context
  const { currentAgentId, isAgentSelected } = useAgentContext();

  // Get agent details for name display
  const { data: agentDetails } = useAgentDetails(
    currentAgentId?.toString() || "",
    isAgentSelected
  );

  // Use both chat hooks - agent chat and regular chat
  const { mutate: sendChatMessage, isPending: isChatPending } =
    useSendChatMessage();
  const { mutate: sendAgentChatMessage, isPending: isAgentChatPending } =
    useSendAgentChatMessage();

  // Load session history when a session is selected
  const { data: sessionHistory, isLoading: isLoadingHistory } =
    useSessionHistory(currentSessionId || 0, !!currentSessionId);

  // Convert history messages to UI messages
  const convertHistoryToUIMessages = (
    historyMessages: HistoryMessage[]
  ): UIMessage[] => {
    return historyMessages.map((msg, index) => ({
      id: `history-${index}`,
      role: msg.role,
      content: msg.content,
      parts: [{ type: "text", text: msg.content }],
      created_at: msg.created_at,
    }));
  };

  // Load session history when sessionHistory data changes
  useEffect(() => {
    if (sessionHistory && Array.isArray(sessionHistory.messages)) {
      const uiMessages = convertHistoryToUIMessages(sessionHistory.messages);
      setMessages(uiMessages);
    } else if (sessionHistory && !sessionHistory.messages) {
      // If session exists but no messages, clear the messages
      setMessages([]);
    }
  }, [sessionHistory, currentSessionId]);

  const handleSessionSelect = (sessionId: number) => {
    // Navigate to the session URL
    if (agentId) {
      const newRoute = ROUTES.AGENT_SESSION_WITH_IDS(
        agentId,
        sessionId.toString()
      );
      navigate(newRoute);
    }
    setStatus("ready");
  };

  const handleNewSession = () => {
    // Navigate back to agent without session
    if (agentId) {
      navigate(ROUTES.AGENT_WITH_ID(agentId));
    }
    setMessages([]);
    setStatus("ready");
  };

  async function sendMessage() {
    if (!input.trim()) {
      return;
    }

    const userMessage = createUIMessage({ role: "user", content: input });
    setStatus("submitted");
    setInput("");

    // Capture current messages state for potential rollback
    const currentMessages = messages;

    // Optimistically add user message
    const newMessages = [...currentMessages, userMessage];
    setMessages(newMessages);

    // Send only the current user message (like the test script does)
    const apiMessages: Message[] = [
      {
        role: userMessage.role,
        content: userMessage.content,
      },
    ];

    // Use agent chat if an agent is selected, otherwise use regular chat
    if (isAgentSelected && currentAgentId) {
      sendAgentChatMessage(
        {
          agentId: currentAgentId,
          messages: apiMessages,
          sessionId: currentSessionId?.toString(),
        },
        {
          onSuccess: (data) => {
            // Support both nested and flat response
            const response = data?.data ?? data;

            // Only add assistant message if it has content
            if (response.message && response.message.trim()) {
              const assistantMessage = createUIMessage({
                role: "assistant",
                content: response.message,
              });

              setMessages((prev) => [...prev, assistantMessage]);
            } else {
              console.warn("Received empty response from API:", response);
            }

            // Navigate to session URL if we got a new session ID
            if (
              "sessionId" in response &&
              response.sessionId &&
              !currentSessionId &&
              agentId
            ) {
              navigate(
                ROUTES.AGENT_SESSION_WITH_IDS(
                  agentId,
                  response.sessionId.toString()
                )
              );
            } else if (
              "data" in response &&
              response.data?.sessionId &&
              !currentSessionId &&
              agentId
            ) {
              navigate(
                ROUTES.AGENT_SESSION_WITH_IDS(
                  agentId,
                  response.data.sessionId.toString()
                )
              );
            }

            setStatus("ready");
          },
          onError: (error: any) => {
            toast.error(
              error.message || "An error occurred. Please try again later.",
              {
                position: "top-center",
              }
            );
            setStatus("error");
            // Revert to original messages state (remove the user message that was optimistically added)
            setMessages(currentMessages);
          },
        }
      );
    } else {
      // Use regular chat for legacy support
      sendChatMessage(
        { messages: apiMessages },
        {
          onSuccess: (data) => {
            // Only add assistant message if it has content
            if (data.message && data.message.trim()) {
              const assistantMessage = createUIMessage({
                role: "assistant",
                content: data.message,
              });
              setMessages((prev) => [...prev, assistantMessage]);
            } else {
              console.warn("Received empty response from API:", data);
            }
            setStatus("ready");
          },
          onError: (error: any) => {
            toast.error(
              error.message || "An error occurred. Please try again later.",
              {
                position: "top-center",
              }
            );
            setStatus("error");
            // Revert to original messages state (remove the user message that was optimistically added)
            setMessages(currentMessages);
          },
        }
      );
    }
  }

  function stop() {
    setStatus("ready");
  }

  const isLoading =
    status === "streaming" ||
    status === "submitted" ||
    isChatPending ||
    isAgentChatPending;

  return (
    <div className="flex h-full w-full">
      <SessionSidebar
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
        agentId={agentId ? parseInt(agentId, 10) : undefined}
      />

      <div className="flex-1 flex flex-col h-full bg-background">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 bg-background/50 backdrop-blur-sm flex-shrink-0">
          <div className="size-8 flex items-center rounded-full justify-center bg-primary/10">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">
              {isAgentSelected && agentDetails?.name
                ? agentDetails.name
                : "AI Assistant"}
            </h3>
            {isLoadingHistory && currentSessionId && (
              <p className="text-xs text-muted-foreground">
                Loading chat history...
              </p>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          {isLoadingHistory && currentSessionId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-muted-foreground">
                  Loading chat history...
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto px-6 py-4">
              <Messages
                messages={messages}
                isLoading={isLoading}
                status={status}
              />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading) sendMessage();
            }}
            className="max-w-3xl mx-auto">
            <ChatTextarea
              handleInputChange={(e) => setInput(e.currentTarget.value)}
              input={input}
              isLoading={isLoading}
              status={status}
              stop={stop}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
