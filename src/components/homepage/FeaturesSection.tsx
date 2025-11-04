import {
  Bot,
  Zap,
  Brain,
  Shield,
  BarChart3,
  Workflow,
  Database,
  MessageSquare,
  Globe,
  Lock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "Multiple AI Providers",
    description: "Choose from OpenAI, Claude, Gemini, or Groq. Switch providers seamlessly based on your needs and budget.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Database,
    title: "Diverse Data Sources",
    description: "Train agents with files, text, websites, databases, and Q&A pairs. Your data, your way.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "Intelligent Training",
    description: "Advanced vector embeddings and semantic search ensure your agents understand context and provide accurate responses.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: MessageSquare,
    title: "Real-time Playground",
    description: "Test and refine your agents in a live chat environment before deployment. Instant feedback, instant improvements.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track performance metrics, token usage, costs, and user engagement. Make data-driven decisions.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Workflow,
    title: "Seamless Workflows",
    description: "Create, train, deploy, and monitor—all in one intuitive platform. No context switching required.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption, role-based access control, and compliance-ready infrastructure.",
    gradient: "from-red-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with caching, lazy loading, and efficient data fetching. Your agents respond instantly.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "API-First Design",
    description: "Integrate ChatVerse into your existing applications with our comprehensive REST API.",
    gradient: "from-teal-500 to-green-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything You Need to Build
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Exceptional AI Agents
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            ChatVerse provides enterprise-grade tools wrapped in an intuitive interface.
            No matter your use case, we've got you covered.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                <CardContent className="p-6">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>

                {/* Hover effect gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            And that's just the beginning. Explore all features →
          </p>
        </div>
      </div>
    </section>
  );
}
