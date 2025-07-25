import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Globe, Database, MessageSquare } from "lucide-react";

interface Source {
  id: string;
  title: string;
  type: "document" | "website" | "database" | "qa";
  url?: string;
  excerpt: string;
  relevance: number;
}

// Mock data for demonstration
const mockSources: Source[] = [
  {
    id: "1",
    title: "Product Documentation",
    type: "document",
    excerpt: "Our product features include advanced AI capabilities, real-time processing, and seamless integration with existing workflows.",
    relevance: 95
  },
  {
    id: "2",
    title: "Company Website - About",
    type: "website",
    url: "https://company.com/about",
    excerpt: "Founded in 2020, we specialize in AI-powered solutions for enterprise customers across various industries.",
    relevance: 87
  },
  {
    id: "3",
    title: "Customer Database",
    type: "database",
    excerpt: "Recent customer feedback shows high satisfaction rates with our support team and product reliability.",
    relevance: 78
  },
  {
    id: "4",
    title: "FAQ - Pricing",
    type: "qa",
    excerpt: "Q: What are your pricing tiers? A: We offer three main plans: Starter ($29/month), Professional ($99/month), and Enterprise (custom pricing).",
    relevance: 92
  }
];

const getSourceIcon = (type: Source["type"]) => {
  switch (type) {
    case "document":
      return FileText;
    case "website":
      return Globe;
    case "database":
      return Database;
    case "qa":
      return MessageSquare;
    default:
      return FileText;
  }
};

const getSourceTypeLabel = (type: Source["type"]) => {
  switch (type) {
    case "document":
      return "Document";
    case "website":
      return "Website";
    case "database":
      return "Database";
    case "qa":
      return "Q&A";
    default:
      return "Unknown";
  }
};

export function ChatSources() {
  return (
    <aside className="flex flex-col w-96 h-full p-6 bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Sources Used</h3>
        <p className="text-sm text-muted-foreground">
          Information sources for the last response
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3">
          {mockSources.map((source) => {
            const Icon = getSourceIcon(source.type);
            return (
              <Card key={source.id} className="p-0">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <CardTitle className="text-sm font-medium leading-tight truncate">
                        {source.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {getSourceTypeLabel(source.type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {source.relevance}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {source.excerpt}
                  </p>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 block truncate"
                    >
                      {source.url}
                    </a>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}