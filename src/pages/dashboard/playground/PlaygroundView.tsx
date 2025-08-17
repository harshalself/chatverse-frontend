import { Chat } from "@/components/dashboard/playground/Chat";
import { ChatSidebar } from "@/components/dashboard/playground/ChatSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function PlaygroundView() {
  const isMobile = useIsMobile();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)]">
        {/* Mobile header with settings button */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Playground</h2>
          <Sheet
            open={isMobileSidebarOpen}
            onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm">
                <Settings className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] p-0">
              <div className="h-full overflow-hidden">
                <ChatSidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Chat area takes remaining space */}
        <div className="flex-1 min-h-0">
          <Chat />
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-[calc(100vh-120px)]">
      <Chat />
      <ChatSidebar />
    </div>
  );
}
