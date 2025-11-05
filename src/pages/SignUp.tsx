import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth, useRegister } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

export default function SignUp() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const registerMutation = useRegister();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeToNewsletter: false,
  });

  // Redirect if already authenticated
  if (user && !isAuthLoading) {
    return <Navigate to="/workspace" replace />;
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone_number) {
      errors.phone_number = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone_number)) {
      errors.phone_number = "Please enter a valid phone number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords don't match";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "Please agree to the terms and conditions";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (registerMutation.isPending) return false;

    if (!validateForm()) {
      return false;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
      });

      // Clear any existing field errors on success
      setFieldErrors({});

      // Show success message and redirect to sign in
      toast({
        title: "Registration Successful",
        description: "Please sign in with your new account.",
      });

      // Redirect to sign in page after successful registration
      // Pass the email to pre-fill the sign-in form
      navigate("/signin", {
        state: {
          email: formData.email,
          message:
            "Registration successful! Please sign in with your new account.",
        },
        replace: true,
      });
    } catch (error: any) {
      // Error handling is done in the hook
      console.error("Registration error:", error);
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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });

    // Clear field error when user checks checkbox
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

      <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl relative z-10">
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
              Create your account
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Join thousands of users building intelligent AI agents
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={fieldErrors.name ? "border-destructive" : ""}
                  required
                />
                {fieldErrors.name && (
                  <p className="text-sm text-destructive">{fieldErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
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
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className={
                    fieldErrors.phone_number ? "border-destructive" : ""
                  }
                  required
                />
                {fieldErrors.phone_number && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.phone_number}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={
                        fieldErrors.password ? "border-destructive" : ""
                      }
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={
                        fieldErrors.confirmPassword ? "border-destructive" : ""
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }>
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("agreeToTerms", checked as boolean)
                    }
                    className={
                      fieldErrors.agreeToTerms ? "border-destructive" : ""
                    }
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                    {fieldErrors.agreeToTerms && (
                      <p className="text-sm text-destructive">
                        {fieldErrors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full text-base py-6 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                disabled={registerMutation.isPending}>
                {registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link to="/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
