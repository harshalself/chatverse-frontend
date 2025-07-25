import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function SettingsView() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your workspace preferences and API settings.
        </p>
      </div>

      {/* Workspace Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Preferences</CardTitle>
          <CardDescription>Customize your workspace behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save Changes</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save agent configurations
              </p>
            </div>
            <Switch
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input
              id="workspace-name"
              defaultValue="My AI Workspace"
              placeholder="Enter workspace name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-agents">Maximum Agents</Label>
            <Select defaultValue="50">
              <SelectTrigger id="max-agents">
                <SelectValue placeholder="Select limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Agents</SelectItem>
                <SelectItem value="25">25 Agents</SelectItem>
                <SelectItem value="50">50 Agents</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure how you receive updates and alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about agent activity
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Browser Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications in your browser
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </CardContent>
      </Card>


      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">Professional Plan</p>
            </div>
            <Button variant="outline">Upgrade Plan</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Usage Reset Date</p>
              <p className="text-sm text-muted-foreground">Next reset: Jan 1, 2024</p>
            </div>
          </div>
          <div className="pt-4">
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
