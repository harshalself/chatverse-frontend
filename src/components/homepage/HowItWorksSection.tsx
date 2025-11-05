import { Bot, Database, Brain, BarChart3, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    icon: Bot,
    title: "Create Your Agent",
    description: "Choose from multiple AI providers (OpenAI, Claude, Gemini, Groq) and configure your agent's personality and capabilities.",
    features: [
      "Select AI provider and model",
      "Customize agent behavior",
      "Set temperature and parameters",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Database,
    title: "Add Data Sources",
    description: "Upload documents, paste text, connect websites, databases, or create Q&A pairs. Your agent learns from your data.",
    features: [
      "Files (PDF, DOCX, TXT)",
      "Websites and URLs",
      "Databases and APIs",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    icon: Brain,
    title: "Train Your Agent",
    description: "Our intelligent training pipeline processes your data, creates embeddings, and builds a knowledge base for your agent.",
    features: [
      "Vector embeddings generation",
      "Semantic search optimization",
      "Real-time status tracking",
    ],
    color: "from-orange-500 to-red-500",
  },
  {
    number: "04",
    icon: BarChart3,
    title: "Deploy & Monitor",
    description: "Test in the playground, integrate via API, and track performance with comprehensive analytics.",
    features: [
      "Live chat playground",
      "REST API integration",
      "Performance analytics",
    ],
    color: "from-green-500 to-emerald-500",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            From Idea to Intelligent Agent
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              In Just 4 Steps
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Building powerful AI agents has never been easier. Our streamlined workflow
            takes you from zero to production in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8 lg:space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 w-px h-8 lg:h-12 bg-gradient-to-b from-border to-transparent hidden md:block" />
                )}

                <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${isEven ? "" : "lg:grid-flow-dense"}`}>
                      {/* Content side */}
                      <div className={`p-8 md:p-12 flex flex-col justify-center ${isEven ? "" : "lg:col-start-2"}`}>
                        <div className="flex items-start gap-4 mb-6">
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex-shrink-0`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <div className="text-6xl font-bold text-muted-foreground/20 leading-none mb-2">
                              {step.number}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                          {step.title}
                        </h3>

                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {step.description}
                        </p>

                        <ul className="space-y-3">
                          {step.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-3 text-foreground">
                              <CheckCircle2 className={`h-5 w-5 flex-shrink-0 bg-gradient-to-br ${step.color} text-white rounded-full p-0.5`} />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Visual side */}
                      <div className={`relative bg-gradient-to-br ${step.color} p-8 md:p-12 flex items-center justify-center min-h-[300px] ${isEven ? "" : "lg:col-start-1"}`}>
                        {/* Decorative elements */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
                          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                        </div>

                        {/* Icon showcase */}
                        <div className="relative z-10 text-white">
                          <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm border border-white/30">
                            <Icon className="h-16 w-16" />
                          </div>
                        </div>

                        {/* Step number watermark */}
                        <div className="absolute bottom-4 right-4 text-[120px] font-bold text-white/10 leading-none">
                          {step.number}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-lg font-medium text-primary group cursor-pointer">
            <span>Ready to get started?</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
}
