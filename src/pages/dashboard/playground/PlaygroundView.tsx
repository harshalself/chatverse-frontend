import { Chat } from "@/components/dashboard/playground/Chat";
import { ChatSidebar } from "@/components/dashboard/playground/ChatSidebar";

export function PlaygroundView() {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-1">
        <ChatSidebar />
        <div className="flex-1 flex justify-center items-center">
          <Chat />
        </div>
      </div>
    </div>
  );
}
