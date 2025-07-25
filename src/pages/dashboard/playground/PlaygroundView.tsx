import { Chat } from "@/components/dashboard/playground/Chat";
import { ChatSidebar } from "@/components/dashboard/playground/ChatSidebar";
import { ChatSources } from "@/components/dashboard/playground/ChatSources";

export function PlaygroundView() {
  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-1">
        <ChatSidebar />
        <div className="flex-1 flex justify-center items-center">
          <Chat />
        </div>
        <ChatSources />
      </div>
    </div>
  );
}
