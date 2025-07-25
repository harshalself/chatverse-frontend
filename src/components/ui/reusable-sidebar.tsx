import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ReusableSidebarProps {
  title: string;
  items: SidebarItem[];
  activeItem: string;
  onItemChange: (item: string) => void;
}

export function ReusableSidebar({ 
  title, 
  items, 
  activeItem, 
  onItemChange 
}: ReusableSidebarProps) {
  return (
    <div className="w-64 border-r bg-background p-4">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onItemChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                activeItem === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}