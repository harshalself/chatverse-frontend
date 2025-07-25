import { Files, Beaker, Globe, Database, HelpCircle } from "lucide-react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";

interface SourcesSidebarProps {
  activeSource: string;
  onSourceChange: (source: string) => void;
}

const sources = [
  { id: "files", label: "Files", icon: Files },
  { id: "text", label: "Text", icon: Beaker },
  { id: "website", label: "Website", icon: Globe },
  { id: "database", label: "Database", icon: Database },
  { id: "qa", label: "Q&A", icon: HelpCircle },
];

export function SourcesSidebar({ activeSource, onSourceChange }: SourcesSidebarProps) {
  return (
    <ReusableSidebar
      title="Sources"
      items={sources}
      activeItem={activeSource}
      onItemChange={onSourceChange}
    />
  );
}