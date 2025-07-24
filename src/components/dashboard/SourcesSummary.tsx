import { Brain, FileText, Type, Globe, Database, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data - in real app this would come from state/props
const mockSources = [
  { id: "1", type: "files", name: "Product Documentation.pdf", count: 1 },
  { id: "2", type: "text", name: "Company Policies", count: 3 },
  { id: "3", type: "website", name: "example.com", count: 1 },
  { id: "4", type: "qa", name: "FAQ Pairs", count: 12 },
];

const sourceIcons = {
  files: FileText,
  text: Type,
  website: Globe,
  database: Database,
  qa: HelpCircle,
};

const sourceLabels = {
  files: "Files",
  text: "Text",
  website: "Website",
  database: "Database",
  qa: "Q&A",
};

export function SourcesSummary() {
  const totalSources = mockSources.reduce((acc, source) => acc + source.count, 0);

  return (
    <div className="w-80 border-l bg-background p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Sources Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{totalSources}</div>
            <div className="text-sm text-muted-foreground">Total Sources Added</div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Source Types
            </h4>
            {mockSources.map((source) => {
              const Icon = sourceIcons[source.type as keyof typeof sourceIcons];
              const label = sourceLabels[source.type as keyof typeof sourceLabels];
              
              return (
                <div key={source.id} className="flex items-center justify-between">
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

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              Recent Sources
            </h4>
            {mockSources.slice(0, 3).map((source) => (
              <div key={source.id} className="text-sm text-foreground truncate">
                {source.name}
              </div>
            ))}
          </div>

          <Separator />

          <Button className="w-full" size="lg">
            <Brain className="h-4 w-4 mr-2" />
            Train Agent
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}