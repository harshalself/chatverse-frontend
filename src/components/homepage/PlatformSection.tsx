import {
  Bot,
  FileText,
  Globe,
  Database as DatabaseIcon,
  HelpCircle,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Clock,
  Zap,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const capabilities = [
  {
    category: "AI Agents",
    icon: Bot,
    color: "from-blue-500 to-cyan-500",
    features: [
      { name: "Multi-Provider Support", icon: Zap, description: "OpenAI, Claude, Gemini, Groq" },
      { name: "Custom Configuration", icon: Shield, description: "Temperature, max tokens, behavior" },
      { name: "Agent Templates", icon: Sparkles, description: "Pre-built agent profiles" },
    ],
  },
  {
    category: "Data Sources",
    icon: DatabaseIcon,
    color: "from-purple-500 to-pink-500",
    features: [
      { name: "File Upload", icon: FileText, description: "PDF, DOCX, TXT, CSV" },
      { name: "Website Crawling", icon: Globe, description: "Scrape and index websites" },
      { name: "Q&A Pairs", icon: HelpCircle, description: "Manual knowledge base" },
    ],
  },
  {
    category: "Training & Deployment",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    features: [
      { name: "Vector Embeddings", icon: Sparkles, description: "Advanced semantic search" },
      { name: "Real-time Status", icon: Clock, description: "Monitor training progress" },
      { name: "Instant Deployment", icon: Zap, description: "Go live in seconds" },
    ],
  },
  {
    category: "Analytics & Insights",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    features: [
      { name: "Performance Metrics", icon: BarChart3, description: "Response time, accuracy" },
      { name: "Usage Analytics", icon: TrendingUp, description: "Track token consumption" },
      { name: "User Engagement", icon: MessageSquare, description: "Conversation insights" },
    ],
  },
];

const stats = [
  {
    value: "4+",
    label: "AI Model Options",
    description: "Choose the perfect model for your use case",
  },
  {
    value: "3",
    label: "Data Source Types",
    description: "Flexible data integration options",
  },
  {
    value: "100%",
    label: "API Coverage",
    description: "Full REST API for custom integrations",
  },
  {
    value: "<5min",
    label: "Training Time",
    description: "Average time to train an agent",
  },
];

export function PlatformSection() {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            A Complete AI Agent
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Management Platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Every tool you need to create, train, deploy, and optimize intelligent AI agents—all in one place.
          </p>
        </div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {capabilities.map((capability, index) => {
            const CategoryIcon = capability.icon;
            return (
              <Card
                key={index}
                className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${capability.color}`}>
                      <CategoryIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl">{capability.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {capability.features.map((feature, featureIndex) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="mt-0.5">
                          <FeatureIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium mb-1">{feature.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats showcase */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-3xl blur-3xl" />
          <Card className="relative border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="font-semibold mb-1">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Shield className="h-4 w-4 mr-2" />
            Enterprise Security
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <Zap className="h-4 w-4 mr-2" />
            99.9% Uptime
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            24/7 Support
          </Badge>
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Continuous Updates
          </Badge>
        </div>
      </div>
    </section>
  );
}
