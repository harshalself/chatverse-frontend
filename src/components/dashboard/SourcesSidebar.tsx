import { Files, Beaker, Globe, Database, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourcesSidebarProps {
  activeSource: string;
  onSourceChange: (source: string) => void;
}

const sources = [
  { id: "files", label: "Files", icon: Files },
  { id: "test", label: "Test", icon: Beaker },
  { id: "website", label: "Website", icon: Globe },
  { id: "database", label: "Database", icon: Database },
  { id: "qa", label: "Q&A", icon: HelpCircle },
];

export function SourcesSidebar({ activeSource, onSourceChange }: SourcesSidebarProps) {
  return (
    <div className="w-64 border-r bg-background p-4">
      <h3 className="font-semibold text-foreground mb-4">Sources</h3>
      <nav className="space-y-1">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <button
              key={source.id}
              onClick={() => onSourceChange(source.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                activeSource === source.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{source.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}