import { useState } from "react";
import { ReusableSidebar } from "@/components/ui/reusable-sidebar";
import { BarChart3, TrendingUp, Users, Zap } from "lucide-react";

const analyticsItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "performance", label: "Performance", icon: TrendingUp },
  { id: "usage", label: "Usage", icon: Users },
  { id: "optimization", label: "Optimization", icon: Zap },
];

export function AnalyticsView() {
  const [activeItem, setActiveItem] = useState("overview");

  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Analytics Overview</h2>
            <p className="text-muted-foreground">High-level performance metrics and insights.</p>
          </div>
        );
      case "performance":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Performance Metrics</h2>
            <p className="text-muted-foreground">Detailed performance analysis and trends.</p>
          </div>
        );
      case "usage":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Usage Analytics</h2>
            <p className="text-muted-foreground">User interactions and usage patterns.</p>
          </div>
        );
      case "optimization":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">Optimization</h2>
            <p className="text-muted-foreground">Recommendations for improving agent performance.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <ReusableSidebar
        title="Analytics"
        items={analyticsItems}
        activeItem={activeItem}
        onItemChange={setActiveItem}
      />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}
