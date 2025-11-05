import { memo, useCallback, useState, useEffect } from "react";
import {
  Bot,
  ChevronDown,
  User,
  LogOut,
  Bell,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { useNotifications } from "@/contexts";
import { Button } from "@/components/ui/button";
import { UserService } from "@/services/user.service";
import { User as UserType } from "@/types/user.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  breadcrumbs: string[];
  children?: React.ReactNode;
}

function HeaderComponent({ breadcrumbs, children }: HeaderProps) {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { mutate: logout } = useLogout();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAllNotifications } =
    useNotifications();
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Fetch real user data from API
  useEffect(() => {
    async function fetchUserData() {
      if (!authUser?.id) return;

      try {
        setIsLoading(true);
        const response = await UserService.getUser(authUser.id);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to auth user data if API fails
        setUserData(authUser as UserType);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [authUser]);

  // Optimize with useCallback to prevent unnecessary function recreations
  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      if (index === 0) {
        // Workspace
        navigate("/workspace");
      }
      // For agent names, we don't navigate since we're already on that page
    },
    [navigate]
  );

  const handleLogoClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleSignOut = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <header className="border-b bg-background px-4 sm:px-6 py-2">
      <div className="flex items-center justify-between">
        {/* Mobile breadcrumbs */}
        <div className="flex items-center space-x-2 md:hidden">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Bot
              className="h-5 w-5 text-primary cursor-pointer"
              onClick={handleLogoClick}
            />
            {breadcrumbs.length > 0 && (
              <>
                <span className="mx-1">/</span>
                <span className="text-foreground font-medium truncate max-w-[120px]">
                  {breadcrumbs[breadcrumbs.length - 1]}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Desktop breadcrumbs */}
        <div className="hidden md:flex items-center space-x-2">
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

        {/* Desktop actions */}
        <div className="hidden md:flex items-center space-x-4">
          {children}
          {authUser && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-8 w-8 p-0">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                  <div className="space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                          onClick={() => markAsRead(notification.id)}>
                          <div
                            className={`h-2 w-2 rounded-full mt-2 ${
                              notification.read
                                ? "bg-muted-foreground"
                                : "bg-primary"
                            }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Intl.RelativeTimeFormat("en", {
                                numeric: "auto",
                              }).format(
                                Math.round(
                                  (notification.timestamp.getTime() -
                                    Date.now()) /
                                    (1000 * 60)
                                ),
                                "minutes"
                              )}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 pt-2">
                    {notifications.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={markAllAsRead}>
                          Mark All Read
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={clearAllNotifications}>
                          Clear All
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {authUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 h-8">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Avatar className="h-6 w-6 mr-1">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {userData?.name?.charAt(0) ||
                          authUser.name?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="hidden sm:inline">
                    {userData?.name || authUser.name}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem disabled>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {userData?.name || authUser.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {userData?.email || authUser.email}
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

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-6 pt-6">
                {/* User profile in mobile */}
                {authUser && (
                  <div className="flex items-center space-x-3 pb-4 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {userData?.name?.charAt(0) ||
                          authUser.name?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {userData?.name || authUser.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {userData?.email || authUser.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile notifications */}
                {authUser && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">
                      Notifications
                    </h3>
                    <div className="space-y-2">
                      {notifications.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.slice(0, 3).map((notification) => (
                          <div
                            key={notification.id}
                            className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                            onClick={() => markAsRead(notification.id)}>
                            <div
                              className={`h-2 w-2 rounded-full mt-2 ${
                                notification.read
                                  ? "bg-muted-foreground"
                                  : "bg-primary"
                              }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Intl.RelativeTimeFormat("en", {
                                  numeric: "auto",
                                }).format(
                                  Math.round(
                                    (notification.timestamp.getTime() -
                                      Date.now()) /
                                      (1000 * 60)
                                  ),
                                  "minutes"
                                )}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2 pt-4 border-t">
                  {children && <div className="mb-4">{children}</div>}
                  {authUser && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

// Optimize rendering with React.memo to prevent unnecessary re-renders
export const Header = memo(HeaderComponent);
