import { useState, useEffect } from "react";
import { Bot, Eye, EyeOff, Sparkles } from "lucide-react";
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
import { Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useLogin } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export default function SignIn() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const loginMutation = useLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/workspace";

  // Get registration state (email and success message)
  const registrationState = location.state;
  const prefilledEmail = registrationState?.email || "";
  const successMessage = registrationState?.message || "";

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Show success message if coming from registration
  useEffect(() => {
    if (successMessage) {
      toast({
        title: "Registration Successful",
        description: successMessage,
        variant: "default",
      });
    }
  }, [successMessage]);

  // Auto-redirect after successful login
  useEffect(() => {
    console.log("SignIn redirect effect:", { user, isAuthLoading, from });
    if (user && !isAuthLoading) {
      console.log("Redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [user, isAuthLoading, navigate, from]);

  // Redirect if already authenticated
  if (user && !isAuthLoading) {
    return <Navigate to={from} replace />;
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (loginMutation.isPending) return false;

    if (!validateForm()) {
      return false;
    }

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      // Success handling is done in the hook
      // Clear any existing field errors on success
      setFieldErrors({});
    } catch (error: any) {
      // Show password field error for authentication failures
      setFieldErrors((prev) => ({
        ...prev,
        password: "Incorrect password. Please try again.",
      }));
      console.error("Login error:", error);
    }

    return false;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-purple-500/5 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background elements matching homepage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
          <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="text-xl sm:text-2xl font-bold">ChatVerse</span>
        </div>

        {/* Back to home link */}
        <div className="mb-6 sm:mb-8 text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2">
            ← Back to home
          </Link>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center px-4 sm:px-6 space-y-4">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Sign in to ChatVerse
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Continue building and managing your AI agents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {/* Display field errors */}
            {Object.keys(fieldErrors).length > 0 && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                <ul className="space-y-1">
                  {Object.entries(fieldErrors).map(([field, error]) => (
                    <li key={field}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
                return false;
              }}
              className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={fieldErrors.email ? "border-destructive" : ""}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.email}
                  </p>
                )}
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
                    className={fieldErrors.password ? "border-destructive" : ""}
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
                {fieldErrors.password && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full text-base py-6 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground">
                Don't have an account?{" "}
              </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
