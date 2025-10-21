import React from "react";
import { useChatStore } from "../store/useChatStore";
import BoarderAnimatedContainer from "../components/BoarderAnimatedContainer";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatContainer from "../components/ChatContainer";
import ProfileHeader from "../components/ProfileHeader";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import FloatingChatMenu from "../components/FloatingMenuButton";

function ChatPage() {
  const { selectedUser } = useChatStore();

  return (
    <div className="relative w-full h-screen flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-700/30">
      {/* Floating circular chat menu */}
      <FloatingChatMenu />

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}
export default ChatPage;
