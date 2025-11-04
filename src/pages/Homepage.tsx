import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/use-auth";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  PlatformSection,
  StatsSection,
  CTASection,
} from "@/components/homepage";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ChatVerse</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a
            href="#features"
            className="transition-colors hover:text-foreground/80 text-foreground/60">
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-foreground/80 text-foreground/60">
            How It Works
          </a>
          <a
            href="#platform"
            className="transition-colors hover:text-foreground/80 text-foreground/60">
            Platform
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/workspace")}>
                Dashboard
              </Button>
              <Button variant="outline" onClick={() => logout()}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col space-y-4 p-4">
            <a
              href="#features"
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}>
              How It Works
            </a>
            <a
              href="#platform"
              className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setIsMenuOpen(false)}>
              Platform
            </a>
            <div className="flex flex-col space-y-2 pt-2">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={() => {
                      navigate("/workspace");
                      setIsMenuOpen(false);
                    }}>
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link to="/signin">Sign in</Link>
                  </Button>
                  <Button asChild className="justify-start">
                    <Link to="/signup">Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ChatVerse</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Build, train, and deploy intelligent AI agents with ease.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#platform" className="hover:text-foreground transition-colors">
                  Platform
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/workspace" className="hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-foreground transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/workspace" className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 ChatVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="platform">
          <PlatformSection />
        </div>
        <StatsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
