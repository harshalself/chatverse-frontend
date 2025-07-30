import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { UserService } from "@/services/user.service";
import { User } from "@/types/user.types";
import { Loader2 } from "lucide-react";

// Interface for profile update
interface ProfileUpdate {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}

export function ProfileSettings() {
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });

  // Load user profile from API
  useEffect(() => {
    async function fetchUserProfile() {
      if (!authUser?.id) return;

      try {
        setIsFetching(true);
        const response = await UserService.getUser(authUser.id);
        const userData = response.data;

        setProfile(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
          title: "Failed to load profile",
          description: "Your profile information could not be loaded",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    }

    fetchUserProfile();
  }, [authUser]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser?.id) return;

    // Validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create update object (only include changed fields)
      const updateData: ProfileUpdate = {};
      if (formData.name !== profile?.name) updateData.name = formData.name;
      if (formData.email !== profile?.email) updateData.email = formData.email;
      if (formData.phone_number !== profile?.phone_number)
        updateData.phone_number = formData.phone_number;
      if (formData.password) updateData.password = formData.password;

      // Skip update if no changes
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "No changes detected",
          description: "Your profile remains unchanged.",
        });
        setIsLoading(false);
        return;
      }

      // Call the update API using our service
      const response = await UserService.updateUser(authUser.id, updateData);
      const updatedUser = response.data;

      // Update local user data
      setProfile(updatedUser);

      // Clear sensitive fields
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        {isFetching ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                disabled={isLoading}
              />
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
