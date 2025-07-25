import { Bot, ChevronDown, User, LogOut } from "lucide-react";
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
