import { APP_CONFIG } from "@/lib/constants";
import { env } from "@/lib/utils";

export default function EnvironmentIndicator() {
  // Only show in development or debug mode
  if (!env.isDevelopment && !env.isDebugMode) {
    return null;
  }

  const getEnvironmentColor = () => {
    switch (APP_CONFIG.environment) {
      case "development":
        return "bg-green-500";
      case "staging":
        return "bg-yellow-500";
      case "production":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`${getEnvironmentColor()} text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg`}>
        {APP_CONFIG.environment.toUpperCase()}
        {env.isDebugMode && " (DEBUG)"}
      </div>
    </div>
  );
}
