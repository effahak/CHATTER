import { MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatsList from "./ChatsList";
import ContactList from "./ContactList";
import ProfileHeader from "./ProfileHeader";
import ActiveTabSwitch from "./ActiveTabSwitch";

function FloatingChatMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeTab } = useChatStore();

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cyan-500 hover:bg-cyan-400 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
      >
        {isOpen ? <XIcon size={22} /> : <MessageSquareIcon size={22} />}
      </button>

      {/* Slide-out menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-slate-800/90 border border-slate-700/50 rounded-2xl backdrop-blur-md shadow-xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 max-h-80 overflow-y-auto p-3 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>
      )}
    </div>
  );
}

export default FloatingChatMenu;
