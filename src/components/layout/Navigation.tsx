import { cn } from "@/lib/utils";

interface NavigationProps {
  tabs: Array<{ label: string; value: string; isActive?: boolean }>;
  onTabChange?: (value: string) => void;
}

export function Navigation({ tabs, onTabChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6">
        <div className="flex justify-center">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  "border-b-2 border-transparent px-1 py-4 text-sm font-medium transition-colors hover:text-foreground",
                  tab.isActive
                    ? "border-primary text-primary"
                    : "text-muted-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}