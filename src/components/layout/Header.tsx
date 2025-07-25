import { Bot, ChevronDown, User, LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HeaderProps {
  breadcrumbs: string[];
  children?: React.ReactNode;
}

export function Header({ breadcrumbs, children }: HeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleBreadcrumbClick = (index: number) => {
    if (index === 0) {
      // Workspace
      navigate("/workspace");
    }
    // For agent names, we don't navigate since we're already on that page
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <header className="border-b bg-background px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bot
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={handleLogoClick}
              />
              <span className="mx-2">/</span>
            </div>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <span
                  className={`${
                    index === breadcrumbs.length - 1
                      ? "text-foreground font-medium"
                      : "cursor-pointer hover:text-foreground transition-colors"
                  }`}
                  onClick={() =>
                    index < breadcrumbs.length - 1 &&
                    handleBreadcrumbClick(index)
                  }>
                  {crumb}
                </span>
                {index < breadcrumbs.length - 1 && (
                  <span className="mx-2">/</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {children}
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full"></span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Agent training completed</p>
                        <p className="text-xs text-muted-foreground">Your sales agent has finished training on new data</p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New conversation started</p>
                        <p className="text-xs text-muted-foreground">Customer support agent received a new inquiry</p>
                        <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Usage limit reminder</p>
                        <p className="text-xs text-muted-foreground">You've used 80% of your monthly quota</p>
                        <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 h-8">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.firstName}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
