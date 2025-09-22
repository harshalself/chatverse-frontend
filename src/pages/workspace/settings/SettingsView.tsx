import { ProfileSettings } from "@/components/agents/ProfileSettings";
import { AccountSettings } from "@/components/agents/AccountSettings";

export function SettingsView() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings.
        </p>
      </div>

      {/* Profile Settings */}
      <ProfileSettings />

      {/* Account Settings - Delete Account */}
      <AccountSettings />
    </div>
  );
}
