import { useState, useEffect } from "react";
import { Bot, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navigate, Link } from "react-router-dom";
import { useSimpleAuth } from "@/hooks/use-simple-auth";
import { toast } from "@/hooks/use-toast";

export default function SimpleSignIn() {
  const { isAuthenticated, isLoading, signIn } = useSimpleAuth();
  
  const [formData, setFormData] = useState({
    email: "test@example.com", // Pre-filled for testing
    password: "password123",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('📄 SignIn page render:', { isAuthenticated, isLoading });

  // Redirect if already authenticated
  if (isAuthenticated && !isLoading) {
    console.log('✅ Already authenticated, redirecting to workspace');
    return <Navigate to="/workspace" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Form submitted:', { email: formData.email });
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await signIn(formData.email, formData.password);
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });
    } catch (error) {
      console.error('❌ Login failed:', error);
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">AgentFlow</span>
        </div>

        {/* Back to home link */}
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account (Simple Auth for Testing)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Test Mode:</strong> Use any email/password combination to sign in.
                Pre-filled credentials are provided for quick testing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoading}>
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}