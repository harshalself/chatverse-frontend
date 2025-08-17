import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  tabs: Array<{ label: string; value: string; isActive?: boolean }>;
  onTabChange?: (value: string) => void;
}

export function Navigation({ tabs, onTabChange }: NavigationProps) {
  const isMobile = useIsMobile();
  const activeTab = tabs.find((tab) => tab.isActive);

  if (isMobile) {
    // Mobile dropdown navigation
    return (
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {activeTab?.label || "Select Tab"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {tabs.map((tab) => (
                <DropdownMenuItem
                  key={tab.value}
                  onClick={() => onTabChange?.(tab.value)}
                  className={cn(
                    "cursor-pointer",
                    tab.isActive && "bg-primary/10 text-primary"
                  )}>
                  {tab.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    );
  }

  // Desktop horizontal navigation
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6">
        <div className="flex justify-center">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  "border-b-2 border-transparent px-1 py-4 text-sm font-medium transition-colors hover:text-foreground whitespace-nowrap",
                  tab.isActive
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
