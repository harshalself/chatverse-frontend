import { useState, memo, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSendChatMessage } from "@/hooks/use-chat";
import type {
  UIMessage as ChatUIMessage,
  Message as ChatMessage,
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
      marginTop: "1rem",
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
    <div className="flex flex-col">
      {isReasoning ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoning</div>
          <div className="animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            className={cn(
              "cursor-pointer rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200",
              {
                "dark:bg-zinc-800 bg-zinc-200": isExpanded,
              }
            )}
            onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && part.text && (
          <motion.div
            key="reasoning"
            className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l pl-3 dark:border-zinc-800"
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
        className="w-full mx-auto px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={`message-${message.id}`}
        data-role={message.role}>
        <div
          className={cn(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            "group-data-[role=user]/message:w-fit"
          )}>
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="">
                <Sparkles size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col w-full space-y-4">
            {message.parts?.map((part, i) => {
              if (part.type === "text") {
                return (
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    key={`message-${message.id}-part-${i}`}
                    className="flex flex-row gap-2 items-start w-full pb-4">
                    <div
                      className={cn("flex flex-col gap-4", {
                        "bg-secondary text-secondary-foreground px-3 py-2 rounded-tl-xl rounded-tr-xl rounded-bl-xl":
                          message.role === "user",
                      })}>
                      <Markdown>{part.text || ""}</Markdown>
                    </div>
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

  return (
    <div className="h-full space-y-4">
      <div className="max-w-xl mx-auto">
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

// Textarea component
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
        className="resize-none bg-secondary w-full rounded-2xl pr-12 pt-2 pb-2 h-12 min-h-[48px] max-h-[48px]"
        value={input}
        autoFocus
        placeholder="Say something..."
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
          className="cursor-pointer absolute right-2 bottom-2 rounded-full p-2 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors">
          <div className="animate-spin h-4 w-4">
            <SpinnerIcon />
          </div>
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-2 bottom-2 rounded-full p-2 bg-black hover:bg-zinc-800 disabled:bg-zinc-300 disabled:dark:bg-zinc-700 dark:disabled:opacity-80 disabled:cursor-not-allowed transition-colors">
          <ArrowUp className="h-4 w-4 text-white" />
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

  // Use the real chat API hook
  const { mutate: sendChatMessage, isPending } = useSendChatMessage();

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = createUIMessage({ role: "user", content: input });
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setStatus("submitted");
    setInput("");

    // Convert UI messages to API messages
    const apiMessages: ChatMessage[] = newMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    sendChatMessage(
      { messages: apiMessages },
      {
        onSuccess: (data) => {
          const assistantMessage = createUIMessage({
            role: "assistant",
            content: data.message,
          });
          setMessages([...newMessages, assistantMessage]);
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
        },
      }
    );
  }

  function stop() {
    setStatus("ready");
  }

  const isLoading =
    status === "streaming" || status === "submitted" || isPending;

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col w-full max-w-lg h-[calc(100%-4rem)] bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-neutral-800">
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
            <Sparkles size={14} />
          </div>
          <div>
            <h3 className="font-medium">AgentFlow Assistant</h3>
          </div>
        </div>
        <div className="h-[calc(100vh-280px)] overflow-y-auto px-4 py-2">
          <Messages messages={messages} isLoading={isLoading} status={status} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading) sendMessage();
          }}
          className="flex-shrink-0 p-2 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
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
  );
}
