import { Bot, FileText, Globe, HelpCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const capabilities = [
  {
    icon: Bot,
    title: "AI Agent Creation",
    description: "Build custom AI agents with multiple provider support including OpenAI, Claude, Gemini, and Groq.",
  },
  {
    icon: FileText,
    title: "File-Based Training",
    description: "Upload and train agents with PDF, DOCX, TXT, and CSV files for domain-specific knowledge.",
  },
  {
    icon: Globe,
    title: "Website Integration",
    description: "Crawl and index websites to give your agents access to web-based information and documentation.",
  },
  {
    icon: HelpCircle,
    title: "Q&A Knowledge Base",
    description: "Create structured knowledge bases with question-answer pairs for precise information retrieval.",
  },
];

export function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Build AI Agents
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            ChatVerse provides the tools and infrastructure to create, train, and deploy intelligent AI agents.
          </p>
        </div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card
                key={index}
                className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
