import { cn } from "@/lib/utils";
import { LucideIcon, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  onItemChange,
}: ReusableSidebarProps) {
  const isMobile = useIsMobile();
  const activeItemData = items.find((item) => item.id === activeItem);

  if (isMobile) {
    // Mobile dropdown version
    return (
      <div className="w-full border-b bg-background p-4">
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <div className="flex items-center space-x-2">
                {activeItemData && <activeItemData.icon className="h-4 w-4" />}
                <span>{activeItemData?.label || "Select"}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => onItemChange(item.id)}
                  className={cn(
                    "cursor-pointer flex items-center space-x-2",
                    activeItem === item.id && "bg-primary/10 text-primary"
                  )}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Desktop sidebar version
  return (
    <div className="w-64 border-r bg-background p-4 sticky top-16 z-40 self-start">
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
              )}>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
