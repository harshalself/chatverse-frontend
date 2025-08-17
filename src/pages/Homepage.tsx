import { Bot, ArrowRight, Star, Users, Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Homepage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { mutate: logout } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ChatVerse</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#"
                className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </a>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/workspace")}>
                    Dashboard
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/signin")}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => navigate("/signup")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="flex flex-col space-y-6 pt-6">
                    {/* Navigation Links */}
                    <div className="space-y-4">
                      <a
                        href="#"
                        className="block text-foreground hover:text-primary transition-colors">
                        Home
                      </a>
                      <a
                        href="#"
                        className="block text-muted-foreground hover:text-foreground transition-colors">
                        Docs
                      </a>
                    </div>

                    {/* Auth Actions */}
                    <div className="space-y-2 pt-4 border-t">
                      {isAuthenticated ? (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              navigate("/workspace");
                              setIsMobileMenuOpen(false);
                            }}>
                            Dashboard
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false);
                            }}>
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => {
                              navigate("/signin");
                              setIsMobileMenuOpen(false);
                            }}>
                            Sign In
                          </Button>
                          <Button
                            className="w-full justify-start"
                            onClick={() => {
                              navigate("/signup");
                              setIsMobileMenuOpen(false);
                            }}>
                            Sign Up
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
            Build Intelligent Agents
            <span className="text-primary"> Effortlessly</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Create, manage, and deploy AI agents with our intuitive platform.
            Connect data sources, customize behaviors, and scale your
            automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-auto"
              onClick={() => navigate("/workspace")}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-auto">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Why Choose ChatVerse?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Everything you need to create powerful AI agents in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Deploy agents in minutes, not hours. Our streamlined workflow
                gets you up and running quickly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Work together seamlessly with your team. Share agents, manage
                permissions, and track usage.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Star className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Enterprise Ready</CardTitle>
              <CardDescription>
                Scale with confidence. Enterprise-grade security, analytics, and
                support for your growing needs.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
            <div className="text-muted-foreground">Active Agents</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Integrations</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 bg-primary/5">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">
            Ready to Build Your First Agent?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-4">
            Join thousands of developers and businesses already using ChatVerse
            to automate their workflows.
          </p>
          <Button
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-auto"
            onClick={() => navigate("/workspace")}>
            Start Building Now
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ChatVerse</span>
              </div>
              <p className="text-muted-foreground">
                The easiest way to build and deploy AI chatbots.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 ChatVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
