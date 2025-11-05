import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-blue-600" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />

      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Ready to Transform Your Workflow with AI?
          </h2>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-100">
            Join thousands of teams using ChatVerse to build intelligent AI agents.
            Start for free, no credit card required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-200">
            <Button
              asChild
              size="lg"
              className="text-lg px-10 py-7 rounded-full bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all shadow-xl group min-w-[200px]">
              <Link to="/signup">
                <Rocket className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 rounded-full bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all min-w-[200px]">
              <Link to="/workspace">
                View Demo
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 hidden lg:block">
          <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/20" />
        </div>
        <div className="absolute bottom-8 right-8 hidden lg:block">
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20" />
        </div>
      </div>
    </section>
  );
}
