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
import { Separator } from "@/components/ui/separator";
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
    if (user && !isAuthLoading && loginMutation.isSuccess) {
      navigate(from);
    }
  }, [user, isAuthLoading, loginMutation.isSuccess, navigate, from]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      // Success toast is handled in the hook
      // Redirect is handled by useEffect when user state updates
    } catch (error) {
      // Error handling is done in the hook
      console.error("Login error:", error);
    }
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
              Sign in to your account to continue building agents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.312-.653-.312-1.618c0-1.515.849-2.646 1.905-2.646.899 0 1.334.675 1.334 1.484 0 .903-.576 2.254-.873 3.504-.248 1.050.526 1.907 1.562 1.907 1.874 0 3.154-2.448 3.154-5.364 0-2.209-1.814-3.842-4.429-3.842-3.142 0-5.061 2.284-5.061 4.861 0 .887.276 1.512.697 1.998.199.199.199.1.199.497-.041.297-.276 1.050-.276 1.194-.041.199-.199.297-.398.199-1.219-.496-1.814-1.844-1.814-3.254 0-2.646 1.939-5.817 5.618-5.817 3.013 0 5.017 2.105 5.017 4.861 0 3.342-1.857 5.817-4.578 5.817-.918 0-1.777-.496-2.059-1.050l-.553 2.105c-.199.797-.698 1.594-1.09 2.254C9.089 23.906 10.537 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
                GitHub
              </Button>
            </div>

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
