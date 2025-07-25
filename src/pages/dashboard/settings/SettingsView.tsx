import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import { Settings, Key, Bell, User } from "lucide-react";

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
            <h2 className="text-2xl font-bold text-foreground mb-4">General Settings</h2>
            <p className="text-muted-foreground">Configure general agent settings and behavior.</p>
          </div>
        );
      case "api":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">API Configuration</h2>
            <p className="text-muted-foreground">Manage API keys and integration settings.</p>
          </div>
        );
      case "notifications":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Notification Settings</h2>
            <p className="text-muted-foreground">Configure notification preferences and alerts.</p>
          </div>
        );
      case "account":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Account Settings</h2>
            <p className="text-muted-foreground">Manage account information and preferences.</p>
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
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
