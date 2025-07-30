import { useState, useMemo } from "react";
import {
  Brain,
  FileText,
  Type,
  Globe,
  Database,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AllSourcesTable,
  Source,
  sourceIcons as importedSourceIcons,
  sourceLabels as importedSourceLabels,
} from "./AllSourcesTable";

// Mock data - all sources added by the user
const allMockSources: Source[] = [
  {
    id: "1",
    type: "files",
    name: "Product Documentation.pdf",
    count: 1,
    dateAdded: "2025-07-25",
  },
  {
    id: "2",
    type: "text",
    name: "Company Policies",
    count: 3,
    dateAdded: "2025-07-26",
  },
  {
    id: "3",
    type: "website",
    name: "example.com",
    count: 1,
    dateAdded: "2025-07-27",
  },
  {
    id: "4",
    type: "qa",
    name: "FAQ Pairs",
    count: 12,
    dateAdded: "2025-07-28",
  },
  {
    id: "5",
    type: "files",
    name: "User Manual.pdf",
    count: 2,
    dateAdded: "2025-07-29",
  },
  {
    id: "6",
    type: "database",
    name: "Customer Database",
    count: 5,
    dateAdded: "2025-07-30",
  },
];

// Mock data for current session
const currentSessionSources: Source[] = [
  { id: "5", type: "files", name: "User Manual.pdf", count: 2 },
  { id: "6", type: "database", name: "Customer Database", count: 5 },
];

// Re-export the icons and labels
const sourceIcons = importedSourceIcons;
const sourceLabels = importedSourceLabels;

export function SourcesSummary() {
  const [isAllSourcesOpen, setIsAllSourcesOpen] = useState(false);

  // Calculate totals
  const totalAllSources = useMemo(
    () => allMockSources.reduce((acc, source) => acc + source.count, 0),
    [allMockSources]
  );

  const totalCurrentSessionSources = useMemo(
    () => currentSessionSources.reduce((acc, source) => acc + source.count, 0),
    [currentSessionSources]
  );

  return (
    <div className="w-80 border-l bg-background p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* All Sources Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground">
                ALL SOURCES
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setIsAllSourcesOpen(true)}>
                View All
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <div className="text-center p-4 bg-muted/20 rounded-lg">
              <div className="text-2xl font-bold text-foreground">
                {totalAllSources}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Sources Added
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Session Sources Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Current Session Sources ({totalCurrentSessionSources})
            </h4>
            {currentSessionSources.map((source) => {
              const Icon = sourceIcons[source.type];
              const label = sourceLabels[source.type];

              return (
                <div
                  key={source.id}
                  className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {source.count}
                  </Badge>
                </div>
              );
            })}
          </div>

          <Separator />

          <Button className="w-full" size="lg">
            <Brain className="h-4 w-4 mr-2" />
            Train Agent
          </Button>
        </CardContent>
      </Card>

      {/* All Sources Table Dialog */}
      <AllSourcesTable
        sources={allMockSources}
        isOpen={isAllSourcesOpen}
        onClose={() => setIsAllSourcesOpen(false)}
      />
    </div>
  );
}
