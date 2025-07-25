import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import { DocumentFiles } from "@/components/dashboard/sources/DocumentFiles";
import { TextSource } from "@/components/dashboard/sources/TextSource";
import { WebsiteSource } from "@/components/dashboard/sources/WebsiteSource";
import { DatabaseSource } from "@/components/dashboard/sources/DatabaseSource";
import { QASource } from "@/components/dashboard/sources/QASource";
import { SourcesSummary } from "@/components/dashboard/sources/SourcesSummary";
import { Files, Beaker, Globe, Database, HelpCircle } from "lucide-react";

interface SourcesViewProps {
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

export function SourcesView({
  activeSource,
  onSourceChange,
}: SourcesViewProps) {
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <ReusableSidebar
        title="Sources"
        items={sources}
        activeItem={activeSource}
        onItemChange={onSourceChange}
      />
      {activeSource === "files" && <DocumentFiles />}
      {activeSource === "text" && <TextSource />}
      {activeSource === "website" && <WebsiteSource />}
      {activeSource === "database" && <DatabaseSource />}
      {activeSource === "qa" && <QASource />}
      <SourcesSummary />
    </div>
  );
}
