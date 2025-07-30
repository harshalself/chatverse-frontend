import { ProfileSettings } from "@/components/agents/ProfileSettings";
import { NotificationSettings } from "@/components/agents/NotificationSettings";
import { AccountSettings } from "@/components/agents/AccountSettings";

export function SettingsView() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your account, notifications, and preferences.
        </p>
      </div>

      {/* Profile Settings */}
      <ProfileSettings />

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Account Settings */}
      <AccountSettings />
    </div>
  );
}
