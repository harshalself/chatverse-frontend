import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import { Settings, Key, Bell, User } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const settingsItems = [
  { id: "general", label: "General", icon: Settings },
  { id: "api", label: "API Keys", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: User },
];

export function SettingsView() {
  const [activeItem, setActiveItem] = useState("general");

  const renderContent = () => {
    switch (activeItem) {
      case "general":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              General Settings
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Configuration</CardTitle>
                  <CardDescription>
                    Configure default agent behavior and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-save conversations</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save conversation history
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Collect usage analytics and insights
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="default-model">Default Model</Label>
                    <Input id="default-model" placeholder="gpt-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "api":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              API Configuration
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys and integration settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openai-key">OpenAI API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="openai-key"
                        type="password"
                        placeholder="sk-..."
                        className="flex-1"
                      />
                      <Button variant="outline">Update</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="anthropic-key"
                        type="password"
                        placeholder="sk-ant-..."
                        className="flex-1"
                      />
                      <Button variant="outline">Update</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Usage Status</p>
                      <p className="text-sm text-muted-foreground">
                        Current monthly usage and limits
                      </p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Notification Settings
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Configure which events trigger email notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Agent status changes</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when agents go online/offline
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Error alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts for system errors
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Get weekly performance summaries
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Account Settings
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Acme Inc." />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-factor authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Secure your account with 2FA
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <ReusableSidebar
        title="Settings"
        items={settingsItems}
        activeItem={activeItem}
        onItemChange={setActiveItem}
      />
      <div className="flex-1">{renderContent()}</div>
    </div>
  );
}
