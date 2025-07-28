import { useState } from "react";
import { Bot, Eye, EyeOff, Check } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
      });

      // Success is handled in the hook
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
      });
    } catch (error) {
      // Error handling is done in the hook
      console.error("Registration error:", error);
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
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Get started with AgentFlow and build your first AI agent
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

              <div className="grid grid-cols-2 gap-4">
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
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}>
                {registerMutation.isPending
                  ? "Creating Account..."
                  : "Create Account"}
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
                Already have an account?{" "}
              </span>
              <Link to="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
