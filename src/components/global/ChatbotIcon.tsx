import { motion } from "framer-motion";
import { MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatbotIconProps {
  isExpanded: boolean;
  onClick: () => void;
  hasUnreadMessages?: boolean;
  className?: string;
}

export function ChatbotIcon({
  isExpanded,
  onClick,
  hasUnreadMessages = false,
  className,
}: ChatbotIconProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("relative", className)}
    >
      <Button
        onClick={onClick}
        size="lg"
        className={cn(
          "relative h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
          "bg-primary hover:bg-primary/90 text-primary-foreground"
        )}
      >
        {/* Notification badge */}
        {hasUnreadMessages && !isExpanded && (
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">•</span>
          </div>
        )}

        {/* Icon content - Show down arrow when expanded, message icon when collapsed */}
        {isExpanded ? (
          <ChevronDown className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </motion.div>
  );
}