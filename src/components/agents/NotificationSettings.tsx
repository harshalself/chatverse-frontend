import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [agentUpdates, setAgentUpdates] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Handle notification setting changes
  const handleNotificationChange = async (type: string, value: boolean) => {
    setIsLoading(true);

    try {
      // Update state based on notification type
      switch (type) {
        case "email":
          setEmailNotifications(value);
          break;
        case "browser":
          setBrowserNotifications(value);
          // Request browser notification permission if enabled
          if (value && "Notification" in window) {
            await Notification.requestPermission();
          }
          break;
        case "agent":
          setAgentUpdates(value);
          break;
      }

      // In a real app, this would update the preferences in the database
      // This is where you'd make an API call to update user preferences

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      toast({
        title: "Update failed",
        description:
          "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });

      // Reset the state to previous value on error
      switch (type) {
        case "email":
          setEmailNotifications(!value);
          break;
        case "browser":
          setBrowserNotifications(!value);
          break;
        case "agent":
          setAgentUpdates(!value);
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configure how you receive updates and alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email updates about agent activity
            </p>
          </div>
          <Switch
            disabled={isLoading}
            checked={emailNotifications}
            onCheckedChange={(checked) =>
              handleNotificationChange("email", checked)
            }
          />
        </div>

        <Separator />

        {/* Browser Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Browser Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Show notifications in your browser
            </p>
          </div>
          <Switch
            disabled={isLoading}
            checked={browserNotifications}
            onCheckedChange={(checked) =>
              handleNotificationChange("browser", checked)
            }
          />
        </div>

        <Separator />

        {/* Agent Updates */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Agent Updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when your agents are updated or retrained
            </p>
          </div>
          <Switch
            disabled={isLoading}
            checked={agentUpdates}
            onCheckedChange={(checked) =>
              handleNotificationChange("agent", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
