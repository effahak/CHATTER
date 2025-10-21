import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";

function ChatContainer() {
  const { selectedUser, getMessagesByUserId, messages } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser?._id);
  }, [selectedUser, getMessagesByUserId]);
  return (
    <div>
      <ChatHeader />
    </div>
  );
}

export default ChatContainer;
