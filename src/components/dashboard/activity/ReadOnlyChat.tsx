import { useState, memo, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionHistory } from "@/hooks/use-chat";
import type { HistoryMessage } from "@/types/chat.types";

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
  created_at?: string;
}

// Message component
const PureMessage = ({ message }: { message: UIMessage }) => {
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      <motion.div
        className="w-full group/message mb-4 sm:mb-6"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={`message-${message.id}`}
        data-role={message.role}>
        <div
          className={cn(
            "flex gap-2 sm:gap-4 w-full",
            message.role === "user" && "flex-row-reverse"
          )}>
          {message.role === "assistant" && (
            <div className="size-6 sm:size-8 flex items-center rounded-full justify-center bg-primary/10 shrink-0 mt-1">
              <Sparkles size={isMobile ? 12 : 14} className="text-primary" />
            </div>
          )}

          <div
            className={cn(
              "flex flex-col space-y-2 max-w-[85%] sm:max-w-[80%]",
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
                      "rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base",
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
                    isReasoning={false} // Always false for readonly
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

const Message = memo(PureMessage);

// Messages component
function Messages({ messages }: { messages: UIMessage[] }) {
  // Use useEffect to handle scrolling when messages change
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center max-w-md">
          <div className="size-12 sm:size-16 flex items-center rounded-full justify-center bg-muted/50 mx-auto mb-3 sm:mb-4">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
            No messages
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            This conversation is empty or hasn't started yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-full pb-4">
      <div className="max-w-4xl mx-auto">
        {messages.map((m, i) => (
          <Message key={i} message={m} />
        ))}
        <div ref={messageEndRef} />
      </div>
    </div>
  );
}

function createUIMessage({
  role,
  content,
  created_at,
}: {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}): UIMessage {
  return {
    id: Math.random().toString(36).slice(2),
    role,
    content,
    parts: [{ type: "text", text: content }],
    created_at,
  };
}

interface ReadOnlyChatProps {
  sessionId?: number | null;
  agentId?: number;
  agentName?: string;
}

export function ReadOnlyChat({
  sessionId,
  agentId,
  agentName = "AI Assistant",
}: ReadOnlyChatProps) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const isMobile = useIsMobile();

  // Load session history when a session is selected
  const { data: sessionHistory, isLoading: isLoadingHistory } =
    useSessionHistory(sessionId || 0, !!sessionId);

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
    } else if (!sessionId) {
      // Clear messages when no session is selected
      setMessages([]);
    }
  }, [sessionHistory, sessionId]);

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-border/50 bg-background/50 backdrop-blur-sm flex-shrink-0">
        <div className="size-7 sm:size-8 flex items-center rounded-full justify-center bg-primary/10 flex-shrink-0">
          <Sparkles size={isMobile ? 14 : 16} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
            {agentName}
          </h3>
          {isLoadingHistory && sessionId && (
            <p className="text-xs text-muted-foreground">
              Loading chat history...
            </p>
          )}
          {!sessionId && (
            <p className="text-xs text-muted-foreground">
              Select a session to view conversation
            </p>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        {isLoadingHistory && sessionId ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
              <p className="text-sm text-muted-foreground">
                Loading chat history...
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
            <Messages messages={messages} />
          </div>
        )}
      </div>

      {/* Footer - No input, just readonly indicator */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-border/50 bg-muted/20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            This is a read-only view of the conversation
          </p>
        </div>
      </div>
    </div>
  );
}
