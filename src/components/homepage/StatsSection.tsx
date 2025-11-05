import { Bot, FileText, Globe, HelpCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatsSection() {
  const stats = [
    {
      value: "3+",
      label: "AI Model Options",
      description: "Choose the perfect model for your use case",
    },
    {
      value: "4",
      label: "Data Source Types",
      description: "Flexible data integration options",
    },
    {
      value: "100%",
      label: "API Coverage",
      description: "Full REST API for custom integrations",
    },
    {
      value: "<30s",
      label: "Training Time",
      description: "Average time to train an agent",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Stats showcase */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-3xl blur-3xl" />
          <div className="relative border border-border/50 bg-card/50 backdrop-blur rounded-3xl p-8 md:p-12">
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
          </div>
        </div>
      </div>
    </section>
  );
}
