import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useLogout } from "@/hooks/use-auth";

export function AccountSettings() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  // Current date + 1 year for next reset (placeholder)
  const nextResetDate = new Date();
  nextResetDate.setFullYear(nextResetDate.getFullYear() + 1);
  const formattedResetDate = nextResetDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    try {
      // Get the authentication token
      const token = localStorage.getItem("authToken");

      // Call the delete user API
      const response = await fetch(
        `http://localhost:8000/api/v1/users/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      // Log the user out and redirect to homepage
      logout();
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      navigate("/");
    } catch (error) {
      console.error("Delete account error:", error);
      toast({
        title: "Failed to delete account",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Plan */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">Professional Plan</p>
            </div>
            <Button variant="outline">Upgrade Plan</Button>
          </div>

          <Separator />

          {/* Usage Reset Date */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Usage Reset Date</p>
              <p className="text-sm text-muted-foreground">
                Next reset: {formattedResetDate}
              </p>
            </div>
          </div>

          {/* Delete Account */}
          <div className="pt-4">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete your account?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data, including agents,
              configurations, and settings will be permanently removed from our
              servers.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md my-2">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Warning: This action is permanent and cannot be reversed.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
