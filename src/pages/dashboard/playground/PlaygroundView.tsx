import { Chat } from "@/components/dashboard/playground/Chat";
import { ChatSidebar } from "@/components/dashboard/playground/ChatSidebar";

export function PlaygroundView() {
  return (
    <div className="flex h-[calc(100vh-120px)]">
      <Chat />
      <ChatSidebar />
    </div>
  );
}
