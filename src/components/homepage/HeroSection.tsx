import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container relative z-10 px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>The Future of AI Agent Management</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up">
            Build, Train, and Deploy
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Intelligent AI Agents
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-100">
            ChatVerse empowers you to create custom AI agents, train them with your data,
            and integrate them seamlessly into your workflow. No coding required.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
            <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full group">
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full">
              <Link to="/workspace">
                View Demo
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 animate-fade-in-up delay-300">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">10,000+</div>
              <div className="text-sm text-muted-foreground">AI Agents Created</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">4.9/5</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>

        {/* Hero image placeholder or animated illustration */}
        <div className="mt-16 relative max-w-5xl mx-auto animate-fade-in-up delay-400">
          <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
            
            {/* Mock interface preview */}
            <div className="aspect-video bg-gradient-to-br from-primary/5 to-purple-500/5 p-8">
              <div className="bg-background/80 backdrop-blur rounded-lg border shadow-lg p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">ChatVerse Dashboard</div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium">Your AI Agents Dashboard</p>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Manage agents, train with custom data sources, and monitor performance in real-time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
