import { SourcesSidebar } from "@/components/dashboard/sources/SourcesSidebar";
import { DocumentFiles } from "@/components/dashboard/sources/DocumentFiles";
import { TextSource } from "@/components/dashboard/sources/TextSource";
import { WebsiteSource } from "@/components/dashboard/sources/WebsiteSource";
import { DatabaseSource } from "@/components/dashboard/sources/DatabaseSource";
import { QASource } from "@/components/dashboard/sources/QASource";
import { SourcesSummary } from "@/components/dashboard/sources/SourcesSummary";

interface SourcesViewProps {
  activeSource: string;
  onSourceChange: (source: string) => void;
}

export function SourcesView({
  activeSource,
  onSourceChange,
}: SourcesViewProps) {
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <SourcesSidebar
        activeSource={activeSource}
        onSourceChange={onSourceChange}
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
