import { Users, Star, TrendingUp, Award, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Users",
    description: "Growing community of AI builders",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "User Rating",
    description: "Based on 2,500+ reviews",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime",
    description: "Enterprise-grade reliability",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Award,
    value: "50+",
    label: "Integrations",
    description: "Connect with your favorite tools",
    color: "from-purple-500 to-pink-500",
  },
];

const testimonials = [
  {
    quote: "ChatVerse transformed how we handle customer support. Our AI agents now resolve 80% of queries instantly.",
    author: "Sarah Johnson",
    role: "CTO, TechCorp",
    initials: "SJ",
    rating: 5,
  },
  {
    quote: "The training pipeline is incredibly fast. We went from concept to production in under an hour.",
    author: "Michael Chen",
    role: "Product Manager, StartupXYZ",
    initials: "MC",
    rating: 5,
  },
  {
    quote: "Best AI agent platform I've used. The analytics dashboard gives us insights we never had before.",
    author: "Emily Rodriguez",
    role: "Head of Operations, ServiceCo",
    initials: "ER",
    rating: 5,
  },
];

const achievements = [
  "SOC 2 Type II Certified",
  "GDPR Compliant",
  "99.9% SLA Guarantee",
  "24/7 Expert Support",
  "Regular Security Audits",
  "Enterprise SSO Support",
];

export function StatsSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Trusted by Thousands</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Join the AI Revolution
            <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Backed by Results
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Thousands of teams trust ChatVerse to power their AI agents. Here's why.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="font-semibold mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
            What Our Users Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border/50 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Rating stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-gradient-to-br from-primary to-purple-600">
                      <AvatarFallback className="bg-transparent text-white font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-8 md:p-12">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-8">
              Enterprise-Grade Security & Compliance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
